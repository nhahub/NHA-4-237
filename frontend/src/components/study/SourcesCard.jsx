function SourcesCard({ citations }) {
    if(citations.length===0){
        return null;
    }

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">
                📚 Sources
            </h2>
            {
                citations.map((citation,index)=>(
                    <div
                        key={index}
                        className="bg-slate-50 rounded-2xl p-5 mb-4 border border-slate-200 hover:shadow-md transition"
                    >
                        <p className="mb-2">
                            📄 <strong>Document:</strong> {citation.source}
                        </p>
                        <p className="mb-2">
                            📑 <strong>Page:</strong> {citation.page}
                        </p>
                        <p>
                            📚 <strong>Chapter:</strong> {citation.chapter}
                        </p>
                    </div>
                ))
            }
        </div>
    );
}

export default SourcesCard;