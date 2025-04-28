import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import apiWrapper from "../api"; 
import "./History.css"
const { api, secondApi } = apiWrapper;

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/api/history/");
        setHistory(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHistory();
  }, []);
  
  return (
    <div className="history-page">
      <Navbar />

      <div className="history-container">
        <h1 className="history-title">Activity History</h1>

        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>{item.activity}</td>
                  <td>{item.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default History;
