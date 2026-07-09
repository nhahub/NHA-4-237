function Button({

  children,

  onClick,

  type = "button",

  variant = "primary",

  className = "",

}) {

  const styles = {

    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",

    success:
      "bg-emerald-600 hover:bg-emerald-700 text-white",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",

    secondary:
      "bg-slate-200 hover:bg-slate-300 text-slate-900",

  };

  return (

    <button

      type={type}

      onClick={onClick}

      className={`
        w-full
        rounded-xl
        py-3
        font-semibold
        transition
        duration-300
        ${styles[variant]}
        ${className}
      `}

    >

      {children}

    </button>

  );

}

export default Button;