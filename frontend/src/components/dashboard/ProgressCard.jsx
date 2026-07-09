function ProgressCard({

    progress = 65

}) {

    return (

        <div className="bg-white rounded-3xl shadow-lg p-6">

            <h2 className="text-xl font-bold">

                📈 Learning Progress

            </h2>

            <div className="w-full h-4 bg-slate-200 rounded-full mt-6">

                <div

                    className="h-4 bg-blue-600 rounded-full transition-all duration-700"

                    style={{
                        width: `${progress}%`
                    }}

                />

            </div>

            <p className="mt-4 text-lg font-semibold">

                {progress}% Completed

            </p>

        </div>

    );

}

export default ProgressCard;