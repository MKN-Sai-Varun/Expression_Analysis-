import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Analysis from './Analysis.jsx';
import '../CSS/Home.css';
import Drop from "./Drop.jsx";
const socket=io(process.env.REACT_APP_ANALYSIS_URL);
function Home() {
  const [database, setDatabase] = useState([]);
  const [filteredDatabase, setFilteredDatabase] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [currentSession, setCurrentSession] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/data');
        setDatabase(response.data);
        setFilteredDatabase(response.data); // Initialize the filtered data
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching the data: ', error);
      }
    };
    fetchData();
    socket.on('updateData',(updatedData)=>{
      setDatabase(updatedData);
      setFilteredDatabase(updatedData);
    });
    return()=>{
      socket.off('updatedData');
    }
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter the database based on the username
    if (term === '') {
      setFilteredDatabase(database); // Show all if search is empty
    } else {
      const filtered = database.filter((list_doc) =>
        list_doc.some((doc) => doc.Username.toLowerCase().includes(term))
      );
      setFilteredDatabase(filtered);
    }
  };

  return (
    <div className="adminPageLayout">
      {/* Navbar */}
      
      {/* Main Content */}
      <div className="adminPageHeading">
        <div>Dashboard</div>
      </div>
      <div className="playerList">
      <nav className="navbar navbar-light bg-light justify-content-between playerNavBar">
      <form className="form-inline Bar">
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search by Username"
            aria-label="Search"
            value={searchTerm}
            onChange={handleSearch}
          />
        </form>
        <a className="navbar-brand tag" style={{fontSize:"20px",display:"flex",
    justifyContent:"center",height:"10vh", color:"white"}}>Search Bar</a>
        
      </nav>
        {filteredDatabase.map((list_doc, index1) => (
          <Drop list_doc={list_doc} key={index1} setCurrentSession={setCurrentSession}/>
        ))}
      </div>
      {currentSession && <Analysis session={currentSession} />}
    </div>
  );
}

export default Home;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Sessions from './Sessions.jsx';
// import DpAnalysis from './DpAnalysis.jsx';
// import './Home.css';
// function Home() {
//   const [database, setDatabase] = useState([]);
//   const [currentSession, setCurrentSession] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('/api/data');
//         setDatabase(response.data);
//         console.log(response.data);
//       } catch (error) {
//         console.error("Error fetching the data: ", error);
//       }
//     };
//     fetchData();
//   }, []);
//   return (
//     <div className="flex1">
//       <div className="Head"><div>Database</div></div>
//       <div className="List">
//         {database.map((list_doc, index1) => (
          
          
          

//           <div className="CON" key={index1}>
//             {list_doc.map((doc,index)=>(
//               <Sessions key={index} session={doc} setCurrentSession={setCurrentSession}/>
//             ))}
//             </div>
//         ))}
        
//       </div>
//       {currentSession && <DpAnalysis session={currentSession} />}
//     </div>
//   );
// }

// export default Home;
// {database.map((doc, index) => (
//   <Sessions key={index} session={doc} setCurrentSession={setCurrentSession}/>
// ))}
// {/* <div class="dropdown">
//   <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//     Dropdown button
//   </button>
//   <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    
//   </div>
// </div> */}

// <a class="dropdown-item" href="#">Action</a>
//     <a class="dropdown-item" href="#">Another action</a>
//     <a class="dropdown-item" href="#">Something else here</a>


// <div className="dropdown" key={index}>
          // <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          //   Dropdown button
          // </button>
          // <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          //   <Sessions className="dropdown-item" href="#" key={index} session={doc} setCurrentSession={setCurrentSession}/>

            
          // </div>
        // </div>
        // <Sessions key={index} session={doc} setCurrentSession={setCurrentSession}/>


//         <div className="dropdown" key={index1}>
//   <button
//     className="btn btn-secondary dropdown-toggle"
//     type="button"
//     id={`dropdownMenuButton-${index1}`}
//     data-bs-toggle="dropdown" // Bootstrap 5 uses "data-bs-toggle" instead of "data-toggle"
//     aria-expanded="false"
//   >
//     Dropdown button
//   </button>
//   <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${index1}`}>
//     {list_doc.map((doc, index) => (
//       <li key={index}>
//         <Sessions session={doc} setCurrentSession={setCurrentSession} />
//       </li>
//     ))}
//   </ul>
// </div>

// {/* <div class="dropdown" key={index1}>
//           <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//             Dropdown button
//           </button>
//           <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
//             {list_doc.map((doc,index)=>(
//               <Sessions key={index} session={doc} setCurrentSession={setCurrentSession}/>
//             ))}
//           </div>
//         </div> */}