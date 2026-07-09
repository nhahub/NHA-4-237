function LoadingScreen({ dots }) {

    return (

        <div className="flex flex-col items-center justify-center py-20">

            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>

            <h2 className="text-2xl font-bold">

                AI is thinking{dots}

            </h2>

            <p className="text-slate-500 mt-3">

                Please wait...

            </p>

        </div>

    );

}

export default LoadingScreen;