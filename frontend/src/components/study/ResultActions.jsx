function ResultActions({

  result,

  onRegenerate,

  onClear

}) {

  if (!result) return null;

  const downloadResult = () => {

    const blob = new Blob(

      [result],

      {

        type: "text/plain"

      }

    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "study_result.txt";

    a.click();

    URL.revokeObjectURL(url);

  };

  return (

    <div className="flex justify-end gap-3 mb-5">

      <button

        onClick={() => navigator.clipboard.writeText(result)}

        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"

      >

        📋 Copy

      </button>

      <button

        onClick={downloadResult}

        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"

      >

        📥 Download

      </button>

      <button

        onClick={onRegenerate}

        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl"

      >

        🔄 Regenerate

      </button>

      <button

        onClick={onClear}

        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"

      >

        🗑 Clear

      </button>

    </div>

  );

}

export default ResultActions;