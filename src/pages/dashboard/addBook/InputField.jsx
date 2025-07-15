import React from 'react';

const InputField = ({
  label,
  name,
  type = 'text',
  register,
  placeholder,
  rules = {},
}) => {
  const commonProps = {
    ...register(name, rules),
    placeholder,
    className: 'p-2 border w-full rounded-md focus:outline-none focus:ring focus:border-blue-300',
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          {...commonProps}
          rows={4}
        />
      ) : (
        <input type={type} {...commonProps} />
      )}
    </div>
  );
};

export default InputField;
