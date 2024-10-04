import React, { useId } from 'react';

const Input = React.forwardRef(function Input({
    label,
    type = "text",
    className = "",
    id,  // Add id prop to allow custom ids
    ...props
}, ref) {
    const autoGeneratedId = useId(); // Use as fallback
    const inputId = id || autoGeneratedId; // Use custom id if passed

    return (
        <div className='w-full'>
            {label && (
                <label className='inline-block mb-1 pl-1' htmlFor={inputId}>
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
                ref={ref}
                {...props}
                id={inputId}  // Use inputId (custom or auto-generated)
            />
        </div>
    );
});

export default Input;
