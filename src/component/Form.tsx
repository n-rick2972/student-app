import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

type formType = {
  isSetInputData: any;
  isSearchInputData: any;
  listYear: any[];
  student: any;
  isEdit: any;
};

type Task = {
  name: string;
  filing: boolean;
  check: boolean;
};

type DefaultTasks = {
  [key: string]: Task[];
};
type Range = {
  name: string;
  range: number;
};

type DefaultRanges = {
  [key: string]: Range[];
};

const Form = ({
  isSetInputData,
  isSearchInputData,
  listYear,
  student,
  isEdit,
}: formType) => {
  let now = new Date().getFullYear();
  let years: any = [];
  if (listYear && listYear.length > 0) {
    years = listYear;
  } else {
    for (let i: number = now - 1; i <= now + 1; i++) {
      years.push(i);
    }
  }

  const defaultRanges: DefaultRanges = {
    default: [
      { name: "Progress", range: 0 },
      { name: "基礎知識", range: 0 },
      { name: "グラフィック", range: 0 },
      { name: "コーディング", range: 0 },
    ],
    web1: [
      { name: "Progress", range: 0 },
      { name: "基礎知識", range: 0 },
      { name: "グラフィック", range: 0 },
      { name: "コーディング", range: 0 },
    ],
    web2: [
      { name: "Progress", range: 0 },
      { name: "基礎知識", range: 0 },
      { name: "グラフィック", range: 0 },
      { name: "コーディング", range: 0 },
      { name: "WordPress", range: 0 },
    ],
    web3: [
      { name: "Progress", range: 0 },
      { name: "基礎知識", range: 0 },
      { name: "グラフィック", range: 0 },
      { name: "コーディング", range: 0 },
    ],
    web4: [
      { name: "Progress", range: 0 },
      { name: "基礎知識", range: 0 },
      { name: "グラフィック", range: 0 },
      { name: "コーディング", range: 0 },
      { name: "WordPress", range: 0 },
    ],
  };

  const defaultTasks: DefaultTasks = {
    default: [
      { name: "グラフィック課題①", filing: false, check: false },
      { name: "グラフィック課題②", filing: false, check: false },
      { name: "コーディング課題①", filing: false, check: false },
      { name: "コーディング課題②", filing: false, check: false },
      { name: "中間課題", filing: false, check: false },
      { name: "卒業制作", filing: false, check: false },
    ],
    web1: [
      { name: "グラフィック課題①", filing: false, check: false },
      { name: "グラフィック課題②", filing: false, check: false },
      { name: "コーディング課題①", filing: false, check: false },
      { name: "コーディング課題②", filing: false, check: false },
      { name: "中間課題", filing: false, check: false },
      { name: "卒業制作", filing: false, check: false },
    ],
    web2: [
      { name: "グラフィック課題①", filing: false, check: false },
      { name: "グラフィック課題②", filing: false, check: false },
      { name: "コーディング課題①", filing: false, check: false },
      { name: "コーディング課題②", filing: false, check: false },
      { name: "中間課題", filing: false, check: false },
      { name: "卒業制作", filing: false, check: false },
      { name: "WordPress化", filing: false, check: false },
    ],
    web3: [
      { name: "グラフィック課題①", filing: false, check: false },
      { name: "グラフィック課題②", filing: false, check: false },
      { name: "コーディング課題①", filing: false, check: false },
      { name: "コーディング課題②", filing: false, check: false },
      { name: "中間課題", filing: false, check: false },
      { name: "卒業制作", filing: false, check: false },
      { name: "超実践課題①", filing: false, check: false },
      { name: "超実践課題②", filing: false, check: false },
    ],
    web4: [
      { name: "グラフィック課題①", filing: false, check: false },
      { name: "グラフィック課題②", filing: false, check: false },
      { name: "コーディング課題①", filing: false, check: false },
      { name: "コーディング課題②", filing: false, check: false },
      { name: "中間課題", filing: false, check: false },
      { name: "卒業制作", filing: false, check: false },
      { name: "超実践課題①", filing: false, check: false },
      { name: "超実践課題②", filing: false, check: false },
      { name: "WordPress化", filing: false, check: false },
    ],
  };

  const [form, setForm] = useState(() => {
    if (student) {
      return {
        id: student.id,
        name: student.name,
        year: student.year,
        month: student.month,
        course: student.course,
        status: student.status,
        target: "",
        purpose: "",
        dates: [],
        rangeValues: defaultRanges[student.course],
        task: defaultTasks[student.course],
        meeting: [],
      };
    } else {
      return {
        id: "",
        name: "",
        year: "",
        month: "",
        course: "default",
        status: "student",
        target: "",
        purpose: "",
        dates: [],
        rangeValues: defaultRanges["default"],
        task: defaultTasks["default"],
        meeting: [],
      };
    }
  });

  const checkDuplicateId = async (inputId: string) => {
    try {
      const studentsCollection = collection(db, "student");

      const q = query(studentsCollection, where("id", "==", inputId));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.size > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error checking duplicate ID: ", error);
      return false;
    }
  };

  const handleChange = (input: any) => async (e: any) => {
    const inputValue = e.target.value;
    const updatedForm = { ...form, [input]: inputValue };

    if (input === "course" && student && student.course) {
      updatedForm.rangeValues = defaultRanges[inputValue];
      updatedForm.task = defaultTasks[inputValue];
    }

    setForm(updatedForm);

    if (isSetInputData) {
      const isDuplicateId = await checkDuplicateId(inputValue);
      if (isDuplicateId) {
        alert("このIDは既に使われています。別のIDを入力してください。");
      } else {
        isSetInputData(updatedForm);
      }
    }

    if (isSearchInputData) {
      isSearchInputData(updatedForm);
    }
  };

  useEffect(() => {
    if (student && student.course) {
      setForm((prevForm) => ({
        ...prevForm,
        task: defaultTasks[student.course],
        rangeValues: defaultRanges[student.course],
      }));
    }
  }, [student?.course]);

  return (
    <>
      {!isEdit && (
        <div className="input-contents text id">
          <label>
            ID
            <input
              type="text"
              name="name"
              placeholder="ID"
              value={form.id}
              onChange={handleChange("id")}
            />
          </label>
        </div>
      )}
      <div className="input-contents text">
        <label>
          氏名
          <input
            type="text"
            name="name"
            placeholder="氏名"
            value={form.name}
            onChange={handleChange("name")}
          />
        </label>
      </div>
      <div className="flex input-contents select">
        <label>
          開始年
          <select value={form.year} onChange={handleChange("year")}>
            <option value="">年</option>
            {years.map((item: any, index: number) => {
              return (
                <option value={item} key={index}>
                  {item}年
                </option>
              );
            })}
          </select>
        </label>
        <label>
          開始月
          <select value={form.month} onChange={handleChange("month")}>
            <option value="">月</option>
            <option value="1">1月</option>
            <option value="2">2月</option>
            <option value="3">3月</option>
            <option value="4">4月</option>
            <option value="5">5月</option>
            <option value="6">6月</option>
            <option value="7">7月</option>
            <option value="8">8月</option>
            <option value="9">9月</option>
            <option value="10">10月</option>
            <option value="11">11月</option>
            <option value="12">12月</option>
          </select>
        </label>
      </div>
      <div className="input-contents course">
        <label>
          学習コース
          <select value={form.course} onChange={handleChange("course")}>
            <option value="">--学習コース--</option>
            <option value="web1">Webデザイナー専攻</option>
            <option value="web2">Webデザイナー専攻+WordPress講座</option>
            <option value="web3">超実践コース</option>
            <option value="web4">超実践コース+WordPress講座</option>
          </select>
        </label>
      </div>
      {isEdit && (
        <div className="input-contents status">
          <label>ステータス</label>
          <div className="flex input-contents radio">
            <label htmlFor="student">
              <input
                type="radio"
                name="student"
                value="student"
                onChange={handleChange("status")}
                checked={form.status === "student"}
              />
              受講中
            </label>
            <label htmlFor="furlough">
              <input
                type="radio"
                name="furlough"
                value="furlough"
                onChange={handleChange("status")}
                checked={form.status === "furlough"}
              />
              休学中
            </label>
            <label htmlFor="graduate">
              <input
                type="radio"
                name="graduate"
                value="graduate"
                onChange={handleChange("status")}
                checked={form.status === "graduate"}
              />
              修了済
            </label>
          </div>
        </div>
      )}
    </>
  );
};

export default Form;
