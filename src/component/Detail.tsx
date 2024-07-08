import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { getDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../Firebase";
import "../assets/Detail.css";
import Progress from "./Progress";
import Header from "./Header";

type LabelListsType = {
  [key: string]: string[];
};

type RangeListType = {
  [key: string]: string[];
};

const fetchLists = async (): Promise<{
  labelListsData: LabelListsType;
  rangeListData: RangeListType;
}> => {
  const labelListsRef = doc(db, "tasks", "labelList");
  const rangeListRef = doc(db, "tasks", "rangeList");

  const labelListsSnapshot = await getDoc(labelListsRef);
  const rangeListSnapshot = await getDoc(rangeListRef);

  const labelListsData = labelListsSnapshot.exists()
    ? (labelListsSnapshot.data() as LabelListsType)
    : {};
  const rangeListData = rangeListSnapshot.exists()
    ? (rangeListSnapshot.data() as RangeListType)
    : {};

  return { labelListsData, rangeListData };
};

const Detail = () => {
  const { id } = useParams<{ id: any }>();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<any>({
    name: "",
    year: "",
    month: "",
    course: "",
    status: "",
    target: "",
    purpose: "",
    dates: [],
    rangeValues: [],
    task: [],
    meeting: [],
  });

  const [labelLists, setLabelLists] = useState<LabelListsType>({});
  const [rangeList, setRangeList] = useState<RangeListType>({});
  const [labelList, setLabelList] = useState<string[]>([]);
  const [ranges, setRanges] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const { labelListsData, rangeListData } = await fetchLists();
      setLabelLists(labelListsData);
      setRangeList(rangeListData);

      await getDetailData();
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDetailData = async () => {
    try {
      const docRef = doc(db, "student", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDetail(data);
      } else {
        console.log("該当するデータがありません。");
        // データが取得できない場合にエラーメッセージを表示するなどの処理を追加する
      }
    } catch (error) {
      console.log(error);
      console.log("データを取得できませんでした。");
      // エラーが発生した場合にエラーメッセージを表示するなどの処理を追加する
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const updatedLabelList = () => {
      if (detail.course && labelLists[detail.course]) {
        setLabelList(labelLists[detail.course]);
      } else {
        setLabelList([]);
      }
    };

    updatedLabelList();
  }, [detail.course, labelLists]);

  useEffect(() => {
    const updatedRangeList = () => {
      if (detail.course && rangeList[detail.course]) {
        setRanges(rangeList[detail.course]);
      } else {
        setRanges([]);
      }
    };

    updatedRangeList();
  }, [detail.course, rangeList]);

  const rewriteCourse = (value: string) => {
    if (value === "web1") {
      return "Webデザイナー専攻";
    } else if (value === "web2") {
      return "Webデザイナー専攻+WordPress講座";
    } else if (value === "web3") {
      return "超実践コース";
    } else if (value === "web4") {
      return "超実践コース+WordPress講座";
    } else if (value === "graphic") {
      return "グラフィックデザイナー専攻";
    } else if (value === "movie") {
      return "動画クリエイター専攻";
    }
  };

  const rewriteStatus = (value: string) => {
    if (value === "student") {
      return "受講中";
    } else if (value === "furlough") {
      return "休学中";
    } else if (value === "graduate") {
      return "修了済";
    }
  };

  const handleTargetButtonClick = (value: string) => {
    setDetail((prevDetail: any) => ({
      ...prevDetail,
      target: value,
    }));
  };

  const handleTextareaBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setDetail((prevDetail: any) => ({
      ...prevDetail,
      purpose: e.target.value,
    }));
  };

  const handleDateChange = (index: number, selectedDate: string) => {
    setDetail((prevDetail: any) => {
      const dates = [...prevDetail.dates];
      dates[index] = selectedDate;
      return { ...prevDetail, dates };
    });
  };

  const handleRangeChange = (index: number, value: string) => {
    setDetail((prevDetail: any) => {
      const rangeValues = [...prevDetail.rangeValues];
      rangeValues[index].range = value;
      return { ...prevDetail, rangeValues };
    });
  };

  const handleFilingToggle = (index: number, value: boolean) => {
    setDetail((prevDetail: any) => {
      const newTask = [...prevDetail.task];
      newTask[index].filing = value;
      return { ...prevDetail, task: newTask };
    });
  };

  const handleCheckToggle = (index: number, value: boolean) => {
    setDetail((prevDetail: any) => {
      const newTask = [...prevDetail.task];
      newTask[index].check = value;
      return { ...prevDetail, task: newTask };
    });
  };

  const editDetailData = () => {
    try {
      const studentRef = doc(db, "student", id);
      setDoc(studentRef, detail);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const deleteStudentData = async () => {
    const confirmDelete = window.confirm("この生徒データを削除しますか？");

    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "student", id));
        console.log("Document successfully deleted!");
        navigate("/");
      } catch (error) {
        console.error("Error removing document: ", error);
      }
    }
  };

  const deleteMeetingData = (index: number) => {
    const confirmDelete = window.confirm(
      "このミーティングデータを削除しますか？"
    );

    if (confirmDelete) {
      setDetail((prevDetail: any) => {
        const newMeeting = [...prevDetail.meeting];
        newMeeting.splice(index, 1);
        return { ...prevDetail, meeting: newMeeting };
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <header className="wrapper">
        <Header />
        <ul className="flex breadcrumb">
          <li>
            <Link to={"/"} onClick={editDetailData}>
              HOME
            </Link>
          </li>
          <li>
            <p>
              {detail.name}({id})
            </p>
          </li>
        </ul>
        <h2>生徒情報</h2>
      </header>
      <div className="wrapper student-data">
        <div className="flex data-header">
          <div className="flex data-header__student">
            <h2>{detail.name}</h2>
            <p>
              {detail.year}年{detail.month}月生
            </p>
            <p>受講区分: {rewriteStatus(detail.status)}</p>
          </div>
          <p>{rewriteCourse(detail.course)}</p>
        </div>
        <div className="target">
          <h3>目標・叶えたいこと</h3>
          <div className="flex target__type">
            <p>目標</p>
            <div className="flex button-area">
              <button
                className={`flex toggle-btn ${
                  detail.target === "転職" ? "active" : ""
                }`}
                value="転職"
                onClick={() => handleTargetButtonClick("転職")}
              >
                転職
              </button>
              <button
                className={`flex toggle-btn ${
                  detail.target === "フリーランス" ? "active" : ""
                }`}
                value="フリーランス"
                onClick={() => handleTargetButtonClick("フリーランス")}
              >
                フリーランス
              </button>
              <button
                className={`flex toggle-btn ${
                  detail.target === "その他" ? "active" : ""
                }`}
                value="その他"
                onClick={() => handleTargetButtonClick("その他")}
              >
                その他
              </button>
            </div>
          </div>
          <div className="flex target__purpose">
            <p>受講の目的</p>
            <textarea
              name="textarea"
              className="textarea"
              rows={5}
              value={detail.purpose}
              onBlur={handleTextareaBlur}
              onChange={(e) => {
                setDetail((prevDetail: any) => ({
                  ...prevDetail,
                  purpose: e.target.value,
                }));
              }}
            ></textarea>
          </div>
        </div>
        <div className="progress">
          <h3>学習進捗</h3>
          <div className="target-date">
            <h4>目標</h4>
            <ul className="flex target-date__list">
              {labelList.map((label, index) => (
                <li key={index} className="flex target-date__list-item">
                  <label htmlFor={`date${index}`}>{label}</label>
                  <input
                    type="date"
                    name={`date${index}`}
                    id={`date${index}`}
                    value={detail.dates[index] || ""}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="progress-area target-progress">
            <h4>進捗</h4>
            <Progress
              rangeValue={detail.rangeValues[0].range}
              onRangeChange={(value: string) => handleRangeChange(0, value)}
            />
          </div>
          <ul className="flex progress-range__list">
            {ranges.map((label: string, index: number) => (
              <li
                key={index}
                className={`progress-range__list-item area${index}`}
              >
                {label}
              </li>
            ))}
          </ul>
          <div className="flex task">
            <div className="video">
              <h4>動画教材</h4>
              <ul className="task__video-list">
                {detail.rangeValues
                  .slice(1)
                  .map((videoItem: any, index: number) => (
                    <li key={index} className="task__video-list__item">
                      <p>{videoItem.name}</p>
                      <div className="flex progress-area">
                        <Progress
                          rangeValue={videoItem.range}
                          onRangeChange={(value: string) =>
                            handleRangeChange(index + 1, value)
                          }
                        />
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="submission">
              <h4>課題制作</h4>
              <ul className="task__submission-list">
                {detail.task.map((taskItem: any, index: number) => (
                  <li key={index} className="flex task__submission-list__item">
                    <p>{taskItem.name}</p>
                    <div className="flex button-area">
                      <button
                        className={`toggle-btn ${
                          taskItem.filing ? "active" : ""
                        }`}
                        onClick={() =>
                          handleFilingToggle(index, !taskItem.filing)
                        }
                      >
                        提出
                      </button>
                      <button
                        className={`toggle-btn ${
                          taskItem.check ? "active" : ""
                        }`}
                        onClick={() =>
                          handleCheckToggle(index, !taskItem.check)
                        }
                      >
                        確認
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="meeting">
          <h3>来校記録</h3>
          <Link
            to={`/detail/${id}/Meeting`}
            state={{
              name: detail.name,
              year: detail.year,
              month: detail.month,
            }}
            className="action-btn"
          >
            追加
          </Link>
          <table className="meeting-table">
            <thead>
              <tr>
                <th>ミーティング名</th>
                <th>実施日時</th>
                <th>担当</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {detail.meeting.map((meetingItem: any, index: number) => (
                <tr key={index}>
                  <td>
                    <Link
                      to={`/detail/${id}/Meeting/${index}`}
                      state={{
                        meetingData: meetingItem,
                        name: detail.name,
                        year: detail.year,
                        month: detail.month,
                        index: index,
                      }}
                    >
                      {meetingItem.title}
                    </Link>
                  </td>
                  <td>{meetingItem.timeStamp}</td>
                  <td>{meetingItem.charge}</td>
                  <td>
                    <button
                      className="delete"
                      onClick={() => deleteMeetingData(index)}
                    ></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button onClick={deleteStudentData} className="delete-btn">
        削除
      </button>
    </>
  );
};

export default Detail;
