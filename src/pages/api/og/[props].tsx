import {ImageResponse} from "@vercel/og";
import {NextRequest} from "next/server";
import {z} from "zod";

export const runtime = "edge";

const schema = z.object({
    v: z.number(),
    state: z.union([
        z.object({
            type: z.literal("intro"),
            name: z.string().optional(),
            backgroundUrl: z.string().min(1)
        }),
        z.object({
            type: z.literal("question"),
            question: z.string(),
            questionUrl: z.string(),
            questionType: z.string(),
            answers: z.array(z.string()).length(4),
            selection: z
                .object({
                    selected: z.number(),
                    correct: z.number(),
                })
                .nullable(),
            backgroundUrl: z.string().min(1)
        }),
        z.object({
            type: z.literal("result"),
            win: z.boolean(),
            backgroundUrl: z.string().min(1)
        }),
    ]),
});

export type Props = z.infer<typeof schema>;

export const ImageData = {
    serialize: (props: z.infer<typeof schema>) =>
        Buffer.from(JSON.stringify(props)).toString("base64url"),
    parse: (props: any) =>
        schema.parse(JSON.parse(Buffer.from(props, "base64url").toString("utf8"))),
};

function Screen(props: Props) {
    console.log(props);
    if (props.state.type === "intro") {
        return (
            <div tw="relative bg-black w-full h-full flex flex-col items-center justify-center">
                <img
                    src={props.state.backgroundUrl}
                    tw="absolute w-full h-full"
                />
                <div style={{
                    fontSize: 150,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    padding: "10px",
                    borderRadius: "8px",
                    color: "#FFFFFF"
                }}>
                    {props.state.name ?? "Quiz"}
                </div>
            </div>
        );
    }

    if (props.state.type === "result") {
        return (
            <div tw="relative bg-black w-full h-full flex flex-col items-center justify-center">
                <img
                    src={props.state.backgroundUrl}
                    tw="absolute w-full h-full"
                />
                <div style={{
                    fontSize: 150,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    padding: "10px",
                    borderRadius: "8px",
                    color: "#FFFFFF"
                }}>
                    {props.state.win ? "You win!" : "You lose!"}
                </div>
                <div
                    tw="flex flex-col items-center text-center"
                    style={{
                        fontSize: 50,
                        marginTop: 100,
                    }}
                >
                    {/*<span>Create your own qiuz at</span>*/}
                    {/*<span style={{ color: "#FFBF00" }}>https://quizframe.xyz/</span>*/}
                </div>
            </div>
        );
    }

    const buttons = ["A", "B", "C", "D"];
    const coords = [
        {x: 123, y: 317},
        {x: 654, y: 317},
        {x: 123, y: 444},
        {x: 654, y: 444},
    ];

    const {selection} = props.state;

    if(props.state.questionType == 'image')
    {
        return (
            <div tw="relative bg-black w-full h-full flex flex-col items-center justify-center">
                {
                    <img
                        src={props.state.backgroundUrl}
                        tw="absolute w-full h-full"
                    />
                }
                <WWTBAMUI
                    green={selection && selection.correct}
                    red={selection && selection.selected}
                />
                <div
                    tw="absolute flex items-center justify-center text-center text-white text-5xl overflow-hidden"
                    style={{
                        left: 164, top: 99, width: 859, height: 154,

                    }}
                >

                    <img
                        src={props.state.questionUrl}
                        style={{
                            width: 64,
                            height: 64,
                        }}
                    />
                </div>

                {props.state.answers.map((answer, index) => {
                    return (
                        <div
                            key={index}
                            tw="absolute flex items-center justify-start text-left text-white text-4xl overflow-hidden"
                            style={{
                                left: coords[index].x,
                                top: coords[index].y,
                                width: 414,
                                height: 85,
                            }}
                        >
            <span>
              <span style={{
                  color: "#FFBF00", marginRight: 10,
              }}>
                {buttons[index]}:
              </span>{" "}
                {answer}
            </span>
                        </div>
                    );
                })}
                <div
                    tw="absolute flex items-center justify-center text-center text-white text-4xl overflow-hidden"
                    style={{
                        left: 325, top: 550, width: 600, height: 70,

                    }}
                >
                    <div tw="relative bg-black w-full h-full flex flex-col items-center justify-center">

              <span
              >
                  Created by
                  <span style={{
                      color: "#5cda09", marginRight: 10, marginLeft: 10
                  }}>D1ol
                  </span>
              </span>
                    </div>
                </div>

            </div>
        );
    }
    return (
        <div tw="relative bg-black w-full h-full flex flex-col items-center justify-center">
            {
                <img
                    src={props.state.backgroundUrl}
                    tw="absolute w-full h-full"
                />
            }
            <WWTBAMUI
                green={selection && selection.correct}
                red={selection && selection.selected}
            />
            <div
                tw="absolute flex items-center justify-center text-center text-white text-5xl overflow-hidden"
                style={{
                    left: 164, top: 99, width: 859, height: 154,

                }}
            >

                {props.state.question}
            </div>

            {props.state.answers.map((answer, index) => {
                return (
                    <div
                        key={index}
                        tw="absolute flex items-center justify-start text-left text-white text-4xl overflow-hidden"
                        style={{
                            left: coords[index].x,
                            top: coords[index].y,
                            width: 414,
                            height: 85,
                        }}
                    >
            <span>
              <span style={{
                  color: "#FFBF00", marginRight: 10,
              }}>
                {buttons[index]}:
              </span>{" "}
                {answer}
            </span>
                    </div>
                );
            })}
            <div
                tw="absolute flex items-center justify-center text-center text-white text-4xl overflow-hidden"
                style={{
                    left: 325, top: 550, width: 600, height: 70,

                }}
            >
                <div tw="relative bg-black w-full h-full flex flex-col items-center justify-center">

              <span
              >
                  Created by
                  <span style={{
                      color: "#5cda09", marginRight: 10, marginLeft: 10
                  }}>D1ol
                  </span>
              </span>
                </div>
            </div>

        </div>
    );
}

export default async function handler(req: NextRequest) {
    const {searchParams} = new URL(req.url);
    const props = ImageData.parse(searchParams.get("props"));

    return new ImageResponse(<Screen {...props} />, {
        width: 1200,
        height: 630,
    });
}

function WWTBAMUI({
                      green,
                      red,
                  }: {
    green: number | null;
    red: number | null;
}) {
    return (
        <svg
            width="1200"
            height="630"
            viewBox="0 0 1200 630"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <line
                x1="-1.31134e-07"
                y1="360.5"
                x2="1200"
                y2="360.5"
                stroke="white"
                stroke-width="3"
            />
            <line
                x1="-1.31134e-07"
                y1="488.5"
                x2="1200"
                y2="488.5"
                stroke="white"
                stroke-width="3"
            />
            <line
                x1="-1.31134e-07"
                y1="179.5"
                x2="1200"
                y2="179.5"
                stroke="white"
                stroke-width="3"
            />
            <path
                d="M127.48 309.996C136.966 309.996 225.929 309.882 318.514 309.763L330.331 309.748C427.03 309.624 524.163 309.5 535.795 309.5C541.03 309.5 545.604 312.252 549.782 316.755C553.966 321.265 557.599 327.371 560.932 333.713C562.304 336.323 563.639 339.004 564.939 341.614C566.744 345.238 568.481 348.724 570.15 351.689C571.603 354.27 573.065 356.572 574.567 358.358C575.368 359.311 576.218 360.161 577.124 360.831C576.177 361.601 575.229 362.517 574.284 363.534C572.609 365.336 570.876 367.525 569.107 369.935C566.752 373.144 564.279 376.82 561.757 380.568C560.508 382.425 559.246 384.299 557.981 386.144C554.133 391.755 550.23 397.121 546.375 401.155C542.464 405.247 538.869 407.678 535.671 407.944C531.962 408.253 505.958 408.412 468.544 408.472C431.193 408.531 382.592 408.491 333.809 408.412C269.718 408.309 205.307 408.137 165.689 408.032C145 407.976 131.072 407.939 127.48 407.939C122.821 407.939 119.365 405.751 116.487 402.117C113.562 398.425 111.321 393.343 109.176 387.796C108.636 386.398 108.101 384.969 107.563 383.531C105.998 379.349 104.406 375.096 102.573 371.336C100.477 367.038 97.9622 363.15 94.583 360.604C95.6294 359.635 96.5833 358.451 97.4662 357.135C98.8361 355.092 100.091 352.642 101.284 349.982C102.779 346.65 104.228 342.859 105.697 339.017C106.553 336.779 107.415 334.524 108.296 332.333C110.727 326.289 113.337 320.636 116.502 316.506C119.654 312.392 123.19 309.996 127.48 309.996Z"
                fill={0 == green ? "#71AD47" : 0 == red ? "#FF0000" : "#060B0F"}
                stroke="white"
                stroke-width="3"
            />
            <path
                d="M652.48 309.996C661.966 309.996 750.929 309.882 843.514 309.763L855.331 309.748C952.03 309.624 1049.16 309.5 1060.8 309.5C1066.03 309.5 1070.6 312.252 1074.78 316.755C1078.97 321.265 1082.6 327.371 1085.93 333.713C1087.3 336.323 1088.64 339.004 1089.94 341.614C1091.74 345.238 1093.48 348.724 1095.15 351.689C1096.6 354.27 1098.06 356.572 1099.57 358.358C1100.37 359.311 1101.22 360.161 1102.12 360.831C1101.18 361.601 1100.23 362.517 1099.28 363.534C1097.61 365.336 1095.88 367.525 1094.11 369.935C1091.75 373.144 1089.28 376.82 1086.76 380.568C1085.51 382.425 1084.25 384.299 1082.98 386.144C1079.13 391.755 1075.23 397.121 1071.38 401.155C1067.46 405.247 1063.87 407.678 1060.67 407.944C1056.96 408.253 1030.96 408.412 993.544 408.472C956.193 408.531 907.592 408.491 858.809 408.412C794.718 408.309 730.307 408.137 690.689 408.032C670 407.976 656.072 407.939 652.48 407.939C647.821 407.939 644.365 405.751 641.487 402.117C638.562 398.425 636.321 393.343 634.176 387.796C633.636 386.398 633.101 384.969 632.563 383.531C630.998 379.349 629.406 375.096 627.573 371.336C625.477 367.038 622.962 363.15 619.583 360.604C620.629 359.635 621.583 358.451 622.466 357.135C623.836 355.092 625.091 352.642 626.284 349.982C627.779 346.65 629.228 342.859 630.697 339.017C631.553 336.779 632.415 334.524 633.296 332.333C635.727 326.289 638.337 320.636 641.502 316.506C644.654 312.392 648.19 309.996 652.48 309.996Z"
                fill={1 == green ? "#71AD47" : 1 == red ? "#FF0000" : "#060B0F"}
                stroke="white"
                stroke-width="3"
            />
            <path
                d="M127.48 436.996C136.966 436.996 225.929 436.882 318.514 436.763L330.331 436.748C427.03 436.624 524.163 436.5 535.795 436.5C541.03 436.5 545.604 439.252 549.782 443.755C553.966 448.265 557.599 454.371 560.932 460.713C562.304 463.323 563.639 466.004 564.939 468.614C566.744 472.238 568.481 475.724 570.15 478.689C571.603 481.27 573.065 483.572 574.567 485.358C575.368 486.311 576.218 487.161 577.124 487.831C576.177 488.601 575.229 489.517 574.284 490.534C572.609 492.336 570.876 494.525 569.107 496.935C566.752 500.144 564.279 503.82 561.757 507.568C560.508 509.425 559.246 511.299 557.981 513.144C554.133 518.755 550.23 524.121 546.375 528.155C542.464 532.247 538.869 534.678 535.671 534.944C531.962 535.253 505.958 535.412 468.544 535.472C431.193 535.531 382.592 535.491 333.809 535.412C269.718 535.309 205.307 535.137 165.689 535.032C145 534.976 131.072 534.939 127.48 534.939C122.821 534.939 119.365 532.751 116.487 529.117C113.562 525.425 111.321 520.343 109.176 514.796C108.636 513.398 108.101 511.969 107.563 510.531C105.998 506.349 104.406 502.096 102.573 498.336C100.477 494.038 97.9622 490.15 94.583 487.604C95.6294 486.635 96.5833 485.451 97.4662 484.135C98.8361 482.092 100.091 479.642 101.284 476.982C102.779 473.65 104.228 469.859 105.697 466.017C106.553 463.779 107.415 461.524 108.296 459.333C110.727 453.289 113.337 447.636 116.502 443.506C119.654 439.392 123.19 436.996 127.48 436.996Z"
                fill={2 == green ? "#71AD47" : 2 == red ? "#FF0000" : "#060B0F"}
                stroke="white"
                stroke-width="3"
            />
            <path
                d="M652.48 436.996C661.966 436.996 750.929 436.882 843.514 436.763L855.331 436.748C952.03 436.624 1049.16 436.5 1060.8 436.5C1066.03 436.5 1070.6 439.252 1074.78 443.755C1078.97 448.265 1082.6 454.371 1085.93 460.713C1087.3 463.323 1088.64 466.004 1089.94 468.614C1091.74 472.238 1093.48 475.724 1095.15 478.689C1096.6 481.27 1098.06 483.572 1099.57 485.358C1100.37 486.311 1101.22 487.161 1102.12 487.831C1101.18 488.601 1100.23 489.517 1099.28 490.534C1097.61 492.336 1095.88 494.525 1094.11 496.935C1091.75 500.144 1089.28 503.82 1086.76 507.568C1085.51 509.425 1084.25 511.299 1082.98 513.144C1079.13 518.755 1075.23 524.121 1071.38 528.155C1067.46 532.247 1063.87 534.678 1060.67 534.944C1056.96 535.253 1030.96 535.412 993.544 535.472C956.193 535.531 907.592 535.491 858.809 535.412C794.718 535.309 730.307 535.137 690.689 535.032C670 534.976 656.072 534.939 652.48 534.939C647.821 534.939 644.365 532.751 641.487 529.117C638.562 525.425 636.321 520.343 634.176 514.796C633.636 513.398 633.101 511.969 632.563 510.531C630.998 506.349 629.406 502.096 627.573 498.336C625.477 494.038 622.962 490.15 619.583 487.604C620.629 486.635 621.583 485.451 622.466 484.135C623.836 482.092 625.091 479.642 626.284 476.982C627.779 473.65 629.228 469.859 630.697 466.017C631.553 463.779 632.415 461.524 633.296 459.333C635.727 453.289 638.337 447.636 641.502 443.506C644.654 439.392 648.19 436.996 652.48 436.996Z"
                fill={3 == green ? "#71AD47" : 3 == red ? "#FF0000" : "#060B0F"}
                stroke="white"
                stroke-width="3"
            />
            <path
                d="M173.996 92.3455C193.512 92.3455 376.542 92.151 567.027 91.9486L591.334 91.9227C790.28 91.7114 990.121 91.5 1014.05 91.5C1025.54 91.5 1035.37 96.519 1044.09 104.313C1052.83 112.125 1060.37 122.648 1067.23 133.476C1070.09 137.976 1072.84 142.563 1075.52 147.015C1079.21 153.171 1082.76 159.068 1086.18 164.116C1089.16 168.501 1092.12 172.36 1095.13 175.326C1097.16 177.322 1099.25 178.958 1101.42 180.069C1095.94 183.454 1090.05 189.29 1083.95 196.174C1079.12 201.631 1074.06 207.868 1068.88 214.248C1066.31 217.421 1063.71 220.63 1061.09 223.795C1053.17 233.368 1045.09 242.589 1037.07 249.546C1029.02 256.533 1021.24 261.044 1013.95 261.547C998.43 262.618 799.281 262.62 598.489 262.351C466.622 262.174 334.108 261.881 252.601 261.701C210.039 261.607 181.386 261.544 173.996 261.544C163.693 261.544 156.142 257.487 150.044 251.106C143.891 244.665 139.227 235.866 134.819 226.411C133.697 224.004 132.59 221.552 131.479 219.09C128.264 211.969 125.017 204.775 121.271 198.405C116.718 190.663 111.314 183.922 104.083 179.811C109.707 175.942 114.347 169.155 118.605 161.283C121.669 155.618 124.629 149.199 127.641 142.667C129.404 138.844 131.184 134.982 133.014 131.21C138.016 120.899 143.434 111.143 150.062 103.971C156.658 96.833 164.363 92.3455 173.996 92.3455Z"
                fill="black"
                stroke="white"
                stroke-width="3"
            />
        </svg>
    );
}
