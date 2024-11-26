import React from "react";

const CustomTable = ({ columns = [], data = [] }) => {
  console.log(columns, data);

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-white dark:text-gray-400">
          <thead className="text-xs text-black uppercase bg-gray-50 dark:bg-gray-700 dark:text-white">
            <tr>
              {columns?.map((col, index) => (
                <th key={index} scope="col" className="px-6 py-3">
                  {col?.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.length === 0 ? (
              <tr>
                <td
                  colSpan={columns?.length || 1}
                  className="text-center text-xl text-red-500 font-bold py-4"
                >
                  Please add some data!
                </td>
              </tr>
            ) : (
              data?.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  {columns?.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      {col.render
                        ? col.render(row[col.accessor], row)
                        : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomTable;
