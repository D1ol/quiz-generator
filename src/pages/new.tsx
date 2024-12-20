import {DataEditor, EditableGridCell, GridCell, GridCellKind, GridColumn, Item,} from "@glideapps/glide-data-grid";
import {Dispatch, Fragment, SetStateAction, useCallback, useEffect, useState,} from "react";
import {Transition} from "@headlessui/react";
import Head from "next/head";
import {useMutation} from "@tanstack/react-query";
import {PublishRequest, PublishResponse, Question} from "./api/publish";

export type OrderStatus = "none" | "uploading" | "processing" | "completed";

const columns: GridColumn[] = [
    {title: "Question", width: 250, grow: 1},
    {title: "A", width: 150},
    {title: "B", width: 150},
    {title: "C", width: 150},
    {title: "D", width: 150},
    {title: "Type", width: 250, grow: 1},
    {title: "Question url", width: 250, grow: 1},
    {title: "Answer", width: 80},
    {title: "BackgroundUrl", width: 80},
];

export default function New() {
    const [questions, setQuestionsRaw] = useLocalState<Question[]>(
        "questions-5",
        [
            {
                question: "What is the capital of France?",
                questionType: 'text',
                questionUrl: '213',
                answers: ["Berlin", "Madrid", "Paris", "Rome"],
                correct: 2,
                backgroundUrl: "https://ucarecdn.com/086039b7-788c-45fe-8af3-9bec5d239a20/"
            },
        ]
    );

    const setQuestions = useCallback(
        (transform: (q: Question[]) => Question[]) => {
            setQuestionsRaw((questions) => {
                const newQuestions = transform(questions).filter((q) => q.question);
                return newQuestions;
            });
        },
        [setQuestionsRaw]
    );

    const getData = useCallback(
        ([col, row]: Item): GridCell => {
            const question = questions[row];
            console.log(question);
            if (!question)
                return {
                    kind: GridCellKind.Text,
                    data: "",
                    displayData: "",
                    allowOverlay: false,
                    readonly: true,
                };
            console.log(question);
            const data = [
                question.question,
                question.answers[0],
                question.answers[1],
                question.answers[2],
                question.answers[3],
                question.questionType,
                question.questionUrl,
                "ABCD".charAt(question.correct),
                question.backgroundUrl
            ][col];
            return {
                kind: GridCellKind.Text,
                data: data,
                allowOverlay: true,
                displayData: data,
                readonly: false,
            };
        },
        [questions]
    );

    const onCellEdited = useCallback(
        ([col, row]: Item, cell: EditableGridCell) =>
            setQuestions((questions) => {
                const question: Question = JSON.parse(JSON.stringify(questions[row]));
                // console.log(question)
                const value = cell.data?.toString() ?? "";

                if (col === 0) {
                    question.question = value;
                }
                if (col <= 4) {
                    question.answers[col - 1] = value;
                }
                if (col === 5) {
                    question.questionType = value;
                }
                if (col === 6) {
                    question.questionUrl = value;
                }
                if (col === 7) {
                    const newIndex = "ABCD".indexOf(value.toUpperCase());
                    question.correct = newIndex === -1 ? question.correct : newIndex;
                }
                if (col === 8) {
                    question.backgroundUrl = value;
                }
                return [
                    ...questions.slice(0, row),
                    question,
                    ...questions.slice(row + 1),
                ];
            }),
        []
    );

    const onRowAppended = useCallback(
        () =>
            setQuestions((questions) => [
                ...questions,
                {
                    question: "New question?",
                    questionType: 'text',
                    questionUrl: '',
                    answers: ["", "", "", ""],
                    correct: 0,
                    backgroundUrl: ""
                },
            ]),
        []
    );

    const onRowMoved = useCallback(
        (from: number, to: number) =>
            setQuestions((questions) => {
                const n = [...questions];
                const old = n[from];
                n[from] = n[to];
                n[to] = old;
                return n;
            }),
        []
    );

    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        setLoaded(true);
    }, []);

    if (!loaded) {
        return null;
    }

    return (
        <div className="foo relative h-screen w-full text-lg">
            <Head>
                <title>Create New Quiz</title>
            </Head>
            <DataEditor
                rowMarkers="both"
                smoothScrollY={false}
                smoothScrollX={true}
                getCellContent={getData}
                getCellsForSelection={true}
                columns={columns}
                rows={questions.length}
                onCellEdited={onCellEdited}
                onRowAppended={onRowAppended}
                onRowMoved={onRowMoved}
                onPaste={true}
            />
            <SavePopup questions={questions}/>
            <style jsx>{`
                .foo > :global(*) {
                    width: 100%;
                    height: 100%;
                }
            `}</style>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div id="portal"/>
            </div>
        </div>
    );
}

function useLocalState<T>(
    key: string,
    defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
        const item = typeof window != "undefined" && localStorage.getItem(key);
        try {
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}

function SavePopup({questions}: { questions: Question[] }) {
    const publish = useMutation<PublishResponse, unknown, {
        name: string,
        backgroundUrl: string,
        randomAnswerLabels: boolean
    }>({
        mutationFn: async ({name, backgroundUrl, randomAnswerLabels}) => {
            const request: PublishRequest = {questions, name, backgroundUrl, randomAnswerLabels};
            const response = await fetch("/api/publish", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(request),
            });
            return response.json();
        },
        onSuccess: (data) => {
            window.open("/q/" + data.id);
        },
    });

    return (
        <div
            aria-live="assertive"
            className="pointer-events-none fixed inset-0 flex items-end px-4 py-6"
        >
            <div className="flex w-full flex-col items-center space-y-4">
                <Transition
                    show={true}
                    as={Fragment}
                    enter="transform ease-out duration-300 transition"
                    enterFrom="translate-y-2 opacity-0"
                    enterTo="translate-y-0 opacity-100"
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-slate-950 shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="p-4">
                            <div className="flex items-center">
                                <div className="flex w-0 flex-1 justify-between items-center">
                                    <p className="w-0 flex-1 text-xs text-gray-200">
                                        {publish.isSuccess
                                            ? "Your quiz has been published!"
                                            : "Add one row per question, then click this button to publish your quiz."}
                                    </p>
                                    <button
                                        type="button"
                                        disabled={publish.isPending}
                                        onClick={() => {
                                            if (publish.isSuccess) {
                                                navigator.clipboard.writeText(
                                                    window.location.origin + "/q/" + publish.data.id
                                                );
                                                return;
                                            }
                                            const name = prompt("What should we name this Quiz?");
                                            const backgroundUrl = prompt("What is background url?(ex. https://ucarecdn.com/086039b7-788c-45fe-8af3-9bec5d239a20/)");
                                            const randomAnswerLabels = !!prompt("Randomise answers labels?") ?? false;

                                            if (name && backgroundUrl && randomAnswerLabels) {
                                                publish.mutate({name, backgroundUrl, randomAnswerLabels});
                                            }
                                        }}
                                        className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-wait"
                                    >
                                        {publish.isSuccess ? "Copy URL" : "Publish"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    );
}
