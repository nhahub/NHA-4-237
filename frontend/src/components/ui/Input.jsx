function Input({

  type = "text",

  placeholder,

  value,

  onChange,

}) {

  return (

    <input

      type={type}

      placeholder={placeholder}

      value={value}

      onChange={onChange}

      className="w-full rounded-xl border border-slate-300 p-4 outline-none focus:border-blue-500"

    />

  );

}

export default Input;