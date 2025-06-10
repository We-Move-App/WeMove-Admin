import { FadeLoader } from "react-spinners";

const Loader = ({ color = "green", height = 15, width = 5 }) => {
    return (
        <div className="fixed inset-0 flex justify-center items-center h-full">
            <FadeLoader color={color} height={height} width={width} />
        </div>
    );
};

export default Loader;
