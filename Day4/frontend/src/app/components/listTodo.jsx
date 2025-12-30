import { useState, useEffect } from "react";
import axios from "axios";

export default function ListTodos() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const res = await axios.get('http://localhost:3000/todo');
                const result = await res.data;
                setData(result.data);
                console.log(result.data);
            }catch(err){
                console.error(err);
            }
        };
        fetchData();
    }, [data]);
    const handleDelete = async (id) => {
        try{
            await axios.delete(`http://localhost:3000/todo/${id}`);
            setData((prev)=> prev.filter((item)=> item._id !== id))
        }catch(err){
            console.error(err);
        }
    }
    return (
    <div className="flex justify-center mt-10 px-4">
  <div className="w-full max-w-5xl bg-gray-900 rounded-2xl shadow-2xl p-6">
    
   
    <h2 className="text-2xl font-bold text-white mb-6 text-center">
      Your Tasks
    </h2>

    <div className="max-h-96 overflow-y-auto rounded-xl">
      <table className="w-full border-separate border-spacing-y-3">
        
       
        <thead className="sticky top-0 z-10">
          <tr className="bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200">
            <th className="px-6 py-3 text-left rounded-l-xl">Task</th>
            <th className="px-6 py-3 text-center">Status</th>
            <th className="px-6 py-3 text-center rounded-r-xl">Action</th>
          </tr>
        </thead>

       
        <tbody>
          {data.map((e) => (
            <tr
              key={e._id}
              className="bg-gray-800 hover:bg-gray-700 transition rounded-xl"
            >
        
              <td className="px-6 py-4 text-white rounded-l-xl">
                {e.text}
              </td>

              <td className="px-6 py-4 text-center">
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold
                    ${
                      e.completed
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                >
                  {e.completed ? "Completed" : "Pending"}
                </span>
              </td>

            
              <td className="px-6 py-4 text-center rounded-r-xl">
                <button
                  onClick={() => handleDelete(e._id)}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold
                             bg-red-500/20 text-red-400
                             hover:bg-red-500 hover:text-white
                             transition duration-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  </div>
</div>

)
}