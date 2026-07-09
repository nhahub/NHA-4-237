function TopicInput({

    topic,

    setTopic,

    onEnter

}) {

    return (

        <input

            type="text"

            placeholder="Enter a topic..."

            value={topic}

            onChange={(e)=>setTopic(e.target.value)}

            onKeyDown={(e)=>{

                if(e.key==="Enter"){

                    onEnter();

                }

            }}

            className="
w-full
bg-white
text-slate-900
placeholder:text-slate-400
border
rounded-2xl
p-5
shadow
mb-8
outline-none
focus:ring-2
focus:ring-blue-500
"

        />

    );

}

export default TopicInput;