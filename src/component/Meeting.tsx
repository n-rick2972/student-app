import { useState, useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";
import "../assets/Meeting.css";
import Header from "./Header";

type MeetingDataType = {
  title: string;
  timeStamp: string;
  charge: string;
  description: string;
  memo: string;
};

const Meeting = () => {
  const { id, index } = useParams<{ id: any; index: any }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { name, year, month }: any = location.state || {};
  const [meeting, setMeeting] = useState<MeetingDataType>({
    title: "",
    timeStamp: "",
    charge: "",
    description: "",
    memo: "",
  });

  useEffect(() => {
    if (location.state && location.state.meetingData) {
      setMeeting(location.state.meetingData);
    }
  }, [location.state]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMeeting((prevMeeting) => ({
      ...prevMeeting,
      [name]: value,
    }));
  };
  const addMeetingData = async () => {
    try {
      const studentRef = doc(db, "student", id);
      const studentDoc = await getDoc(studentRef);
      if (studentDoc.exists()) {
        const studentData = studentDoc.data();
        const meetingArray = studentData.meeting || [];
        const updatedMeetingArray = [...meetingArray, meeting];
        await updateDoc(studentRef, { meeting: updatedMeetingArray });
        navigate(`/detail/${id}`);
      } else {
        console.error("Student document not found");
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const updateMeetingData = async () => {
    try {
      const studentRef = doc(db, "student", id);
      const studentDoc = await getDoc(studentRef);
      if (studentDoc.exists()) {
        const studentData = studentDoc.data();
        const meetingArray = studentData.meeting || [];
        meetingArray[index] = meeting;
        await updateDoc(studentRef, { meeting: meetingArray });
        navigate(`/detail/${id}`);
      } else {
        console.error("Student document not found");
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <>
      <header className="wrapper">
        <Header />
        <ul className="flex breadcrumb">
          <li>
            <Link to={"/"}>HOME</Link>
          </li>
          <li>
            <Link to={`/detail/${id}`}>
              {name}({id})
            </Link>
          </li>
          <li>来校記録</li>
        </ul>
        <h2>来校記録</h2>
      </header>
      <div className="wrapper flex data-header">
        <div className="flex data-header__student">
          <h2>{name}</h2>
          <p>
            {year}年{month}月生
          </p>
        </div>
      </div>
      <div className="wrapper flex meeting-detail">
        <div className="meeting-overview">
          <label htmlFor="title">ミーティング名</label>
          <input
            type="text"
            name="title"
            className="title"
            value={meeting.title}
            onChange={handleInputChange}
          />
          <div className="flex label-groupe">
            <label htmlFor="timestamp" className="flex timestamp">
              日時
              <input
                type="datetime-local"
                step="300"
                name="timeStamp"
                value={meeting.timeStamp}
                onChange={handleInputChange}
              />
            </label>
            <label htmlFor="charge" className="flex charge">
              担当者
              <input
                type="text"
                name="charge"
                value={meeting.charge}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <label htmlFor="memo">メモ</label>
          <textarea
            name="memo"
            id=""
            cols={30}
            rows={10}
            value={meeting.memo}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div className="meeting-description">
          <label htmlFor="description">ミーティング内容</label>
          <textarea
            name="description"
            id="description"
            cols={30}
            rows={10}
            value={meeting.description}
            onChange={handleInputChange}
          ></textarea>
        </div>
      </div>
      {location.state && location.state.meetingData ? (
        <button onClick={updateMeetingData} className="action-btn meeting-btn">
          更新
        </button>
      ) : (
        <button onClick={addMeetingData} className="action-btn meeting-btn">
          追加
        </button>
      )}
    </>
  );
};

export default Meeting;
