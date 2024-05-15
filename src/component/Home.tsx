import React from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../Firebase";
import { useState, useEffect } from "react";
import "../assets/Home.css";
import Header from "./Header";
import Search from "./Search";
import Register from "./Register";

const Home = () => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [studentData, setStudentData] = useState<any[]>([]);
  const [listYear, setListYear] = useState<any[]>([]);
  const [search, setSearch] = useState({
    name: "",
    year: "",
    month: "",
    course: "",
    student: false,
    furlough: false,
    graduate: false,
  });
  const [filteredData, setFilteredData] = useState<any>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const openEditModal = (student: any) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const rewriteCourse = (value: string) => {
    if (value === "web1") {
      return "Webデザイナー専攻";
    } else if (value === "web2") {
      return "Webデザイナー専攻+WordPress講座";
    } else if (value === "web3") {
      return "超実践コース";
    } else if (value === "web4") {
      return "超実践コース+WordPress講座";
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

  const getStudentList = async () => {
    setIsLoading(true);
    try {
      const studentRef = collection(db, "student");
      const querySnapshot = await getDocs(
        query(studentRef, orderBy("id", "desc"))
      );

      const dataArray: any[] = [];
      const yearArray: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        dataArray.push({
          id: data.id,
          name: data.name,
          year: data.year,
          month: data.month,
          course: data.course,
          status: data.status,
        });
        yearArray.push(data.year);
      });
      setStudentData(dataArray);
      setFilteredData(dataArray);
      setListYear(Array.from(new Set(yearArray)));
    } catch (error) {
      console.log(error);
      console.log("データを取得できませんでした。");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStudentList();
  }, []);

  const handleGetList = () => {
    getStudentList();
  };

  const handleSearch = (e: any) => {
    e.preventDefault();

    const { name, year, month, course, student, furlough, graduate } = search;

    const filteredData = studentData.filter((st: any) => {
      const nameMatch = !name || st.name.includes(name);
      const yearMatch = !year || st.year === year;
      const monthMatch = !month || st.month === month;
      const courseMatch = !course || st.course === course;
      const statusMatch =
        (!student && !furlough && !graduate) ||
        (student && st.status === "student") ||
        (furlough && st.status === "furlough") ||
        (graduate && st.status === "graduate");

      return nameMatch && yearMatch && monthMatch && courseMatch && statusMatch;
    });
    setFilteredData(filteredData);
  };

  return (
    <>
      <header className="wrapper">
        <Header />
        <h2>生徒一覧</h2>
      </header>
      <div className="wrapper search">
        <Search search={search} setSearch={setSearch} listYear={listYear} />
        <input
          type="submit"
          className="action-btn"
          value="Search"
          onClick={handleSearch}
        />
      </div>
      <div className="wrapper student">
        <button className="action-btn" onClick={openAddModal}>
          追加
        </button>
        <Register
          show={showAddModal}
          setShow={setShowAddModal}
          isEdit={false}
          getList={handleGetList}
        />
        <table>
          <thead>
            <tr>
              <th>名前</th>
              <th>受講開始年月</th>
              <th>コース</th>
              <th>ステータス</th>
              <th>編集</th>
            </tr>
          </thead>
          {isLoading ? (
            <tbody>
              <tr>
                <td>データを読み込んでいます...</td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {filteredData.map((student: any, index: any) => (
                <tr key={index}>
                  <td>
                    <Link
                      to={`/detail/${student.id}`}
                      state={{
                        student: student,
                        rewriteCourse: rewriteCourse(student.course),
                        rewriteStatus: rewriteStatus(student.status),
                      }}
                    >
                      {student.name}
                    </Link>
                  </td>
                  <td>
                    {student.year}年{student.month}月
                  </td>
                  <td>{rewriteCourse(student.course)}</td>
                  <td>{rewriteStatus(student.status)}</td>
                  <td>
                    <button
                      className="edit"
                      onClick={() => openEditModal(student)}
                    ></button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      {showEditModal && (
        <Register
          show={showEditModal}
          setShow={setShowEditModal}
          student={selectedStudent}
          isEdit={true}
          getList={handleGetList}
        />
      )}
    </>
  );
};

export default Home;
