import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";
import "../assets/Modal.css";
import Form from "./Form";
import { useState } from "react";

type StudentType = {
  show: boolean;
  setShow: any;
  student?: any;
  isEdit?: boolean;
  getList: any;
};

const Register = ({ show, setShow, student, isEdit, getList }: StudentType) => {
  const [inputData, setInputData] = useState<any>(student);

  const isSetInputData = (data: any) => {
    setInputData(data);
  };

  const closeModal = () => {
    setShow(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const studentRef = doc(db, "student", inputData.id);
      if (isEdit) {
        await updateDoc(studentRef, inputData);
      } else {
        await setDoc(studentRef, inputData);
      }
      closeModal();
      getList();
    } catch (error) {
      console.error("Error adding/updating document: ", error);
    }
  };

  return (
    <>
      {show && (
        <div className="flex overlay">
          <div className="modal-content">
            <h3>{isEdit ? "生徒情報編集" : "生徒情報入力"}</h3>
            <p>
              {isEdit ? "生徒情報を編集します。" : "生徒情報を登録します。"}
            </p>
            <div className="form-area">
              <Form
                isSetInputData={isSetInputData}
                isSearchInputData={undefined}
                listYear={[]}
                student={inputData}
                isEdit={isEdit}
              />
            </div>
            <div className="flex button-area">
              <button
                type="submit"
                className="action-btn cancel"
                onClick={closeModal}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="action-btn"
                onClick={handleSubmit}
              >
                {isEdit ? "更新" : "登録"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
