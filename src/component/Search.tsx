import Form from "./Form";

type searchType = {
  search: any;
  setSearch: any;
  listYear: any;
};

const Search = ({ search, setSearch, listYear }: searchType) => {
  const handleRadioClick =
    (input: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch({ ...search, [input]: e.target.checked });
    };

  const student = {
    id: "",
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
  };

  return (
    <div className="flex search__form">
      <Form
        isSearchInputData={setSearch}
        listYear={listYear}
        isSetInputData={undefined}
        student={student}
        isEdit={undefined}
      />
      <div className="flex input-contents check">
        <label className="flex">
          <input
            type="checkbox"
            value="student"
            onChange={handleRadioClick("student")}
          />
          受講中
        </label>
        <label className="flex">
          <input
            type="checkbox"
            value="furlough"
            onChange={handleRadioClick("furlough")}
          />
          休学中
        </label>
        <label className="flex">
          <input
            type="checkbox"
            value="graduate"
            onChange={handleRadioClick("graduate")}
          />
          修了済
        </label>
      </div>
    </div>
  );
};

export default Search;
