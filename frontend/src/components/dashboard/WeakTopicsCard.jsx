function WeakTopicsCard({ topics = [] }) {

  return (

    <div className="bg-white rounded-3xl shadow-lg p-6 h-full">

      <h2 className="text-xl font-bold mb-6">

        🎯 Weak Topics

      </h2>

      {
        topics.length === 0 ? (

          <div className="text-slate-500">

            🎉 Great Job!

            <br />

            No weak topics detected yet.

          </div>

        ) : (

          <div className="space-y-4">

            {
              topics.map((topic, index) => (

                <div
                  key={index}
                  className="bg-slate-100 rounded-xl p-3 font-medium"
                >

                  🔴 {topic}

                </div>

              ))
            }

          </div>

        )
      }

    </div>

  );

}

export default WeakTopicsCard;