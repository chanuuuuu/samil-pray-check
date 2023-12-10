"use client";

export default function RequestGroup(props: { requests: string[] }) {
    const { requests } = props;

    return (
        <>
            {requests.map((request, index) => (
                <div
                    className="whitespace-normal pb-0.5"
                    key={`request_${index}`}
                >
                    {"> "}
                    {request}
                </div>
            ))}
        </>
    );
}
