function StatCard({

    title,

    value,

    icon,

    color = "text-blue-600"

}) {

    return (

        <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition">

            <div className="flex justify-between items-center">

                <h2 className="text-slate-500 text-lg">

                    {title}

                </h2>

                <span className="text-3xl">

                    {icon}

                </span>

            </div>

            <p className={`text-4xl font-bold mt-6 ${color}`}>

                {value}

            </p>

        </div>

    );

}

export default StatCard;