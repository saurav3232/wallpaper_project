import React, { useState, useEffect } from "react";
import { Follow } from "../follow/follow.component";
import { getUserList } from "../../utils/Firebase/Firebase.utils";
import { Link } from "react-router-dom";
import "./leaderboard.styles.css";
const LeaderBoard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      setLeaderboardData(await getUserList());
    };
    getUsers();
  }, []);

  return (
    <div className="leaderboard-container">
      <table>
        <thead>
          <tr className="table-row">
            <th className="table-row">Rank</th>
            <th className="table-row">Username</th>
            <th className="table-row">Views</th>
            <th className="table-row">Follow</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              {console.log(item.uid)}
              <td>
                <Link
                  style={{ textDecoration: "none" }}
                  to={{ pathname: `/creater/${item.uid}`}}
                >
                  {item.displayName}
                </Link>
              </td>
              <td>{item.views}</td>
              <td>
                <Follow createrId={item.uid} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderBoard;
