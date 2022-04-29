import React, { useState, useEffect } from "react";
import "./App.css";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

function App() {
  const [data, setData] = useState(); //110所有資料
  const [data108, setData108] = useState(); //108所有資料
  const [siteId, setSiteId] = useState([]); //所有縣市
  const [areaHandler, setAreaHandler] = useState([]); //行政區
  const [villag, setVillag] = useState([]); //鄉里
  const [householdOrd, setHouseholdOrd] = useState(0); //共同生活戶
  const [householdSingle, setHouseholdSingle] = useState(0); //獨立生活戶

  const [householdOrd108, setHouseholdOrd108] = useState(0); //108共同生活戶
  const [householdSingle108, setHouseholdSingle108] = useState(0); //108獨立生活戶

  const labels = ["共同生活戶", "獨立生活戶"];
  const dataChart = {
    label: "各縣市人口分布",
    labels,
    datasets: [
      {
        type: "bar",
        label: "110年男性",
        data: [householdOrd.OrdinaryM, householdSingle.SingleM],
        backgroundColor: ["rgba(122, 192, 253, 0.524)"],
        borderColor: ["rgb(29, 135, 222)"],
        borderWidth: 1,
      },
      {
        type: "line",
        label: "108年男性",
        data: [householdOrd108.OrdinaryM108, householdSingle108.SingleM108],
        backgroundColor: ["rgb(29, 135, 222)"],
        borderColor: ["rgb(29, 135, 222)"],
        borderWidth: 1,
      },
      {
        type: "bar",
        label: "110年女性",
        data: [householdOrd.OrdinaryF, householdSingle.SingleF],
        backgroundColor: ["rgb(255, 157, 221, 0.524)"],
        borderColor: [" rgb(251, 111, 202)"],
        borderWidth: 1,
      },
      {
        type: "line",
        label: "108年女性",
        data: [householdOrd108.OrdinaryF108, householdSingle108.SingleF108],
        backgroundColor: ["rgb(251, 111, 202)"],
        borderColor: [" rgb(251, 111, 202)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: "各縣市人口分布",
    },
  };

  // console.log(data)
  useEffect(() => {
    (async function () {
      const response = await fetch(
        "https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP019/110"
      );
      const dataFetch = await response.json();
      setData(dataFetch.responseData);
      const districtData = dataFetch.responseData.filter((v, i) => {
        return v.site_id;
      });
      //  console.log(districtData)
      const district = [];
      districtData.forEach((v) => {
        if (!district.includes(v.site_id.slice(0, 3))) {
          district.push(v.site_id.slice(0, 3));
        }
      });
      setSiteId(district);
      // console.log(district)
    })();
    //108年
    (async function () {
      const response = await fetch(
        "https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP019/108"
      );
      const dataFetch = await response.json();
      setData108(dataFetch.responseData);
    })();
  }, []);

  //選出行政區
  function districtSelection(e) {
    setAreaHandler([]);
    setVillag([]);
    let distirctHandler = e.target.value;
    const administrative = data.filter((v, i) => {
      return v.site_id.includes(distirctHandler);
    });
    const administrative108 = data108.filter((v, i) => {
      return v.site_id.includes(distirctHandler);
    });

    const area = [];
    administrative.forEach((v) => {
      if (!area.includes(v.site_id.slice(3))) {
        area.push(v.site_id.slice(3));
      }
    });
    setAreaHandler(area);
    // console.log(area)
    e.target.nextSibling.value = "所有行政區";
    const householdOrdinaryM = [];
    const householdOrdinaryF = [];
    const householdSingleM = [];
    const householdSingleF = [];

    administrative.map((v) => {
      householdOrdinaryM.push(+v.household_ordinary_m); //共同生活戶_男
      householdOrdinaryF.push(+v.household_ordinary_f); //共同生活戶_女
      householdSingleM.push(+v.household_single_m); //單獨生活戶_男
      householdSingleF.push(+v.household_single_f); //單獨生活戶_女
    });
    // console.log(administrative)

    //取總數
    const OrdinaryM = householdOrdinaryM.reduce((a, b) => a + b);
    const OrdinaryF = householdOrdinaryF.reduce((a, b) => a + b);
    const SingleM = householdSingleM.reduce((a, b) => a + b);
    const SingleF = householdSingleF.reduce((a, b) => a + b);

    setHouseholdOrd({
      OrdinaryM: OrdinaryM,
      OrdinaryF: OrdinaryF,
    });
    setHouseholdSingle({
      SingleM: SingleM,
      SingleF: SingleF,
    });

    //108年資料
    const householdOrdinaryM108 = [];
    const householdOrdinaryF108 = [];
    const householdSingleM108 = [];
    const householdSingleF108 = [];
    administrative108.map((v) => {
      householdOrdinaryM108.push(+v.household_ordinary_m); //共同生活戶_男
      householdOrdinaryF108.push(+v.household_ordinary_f); //共同生活戶_女
      householdSingleM108.push(+v.household_single_m); //單獨生活戶_男
      householdSingleF108.push(+v.household_single_f); //單獨生活戶_女
    });
    //取總數
    const OrdinaryM108 = householdOrdinaryM108.reduce((a, b) => a + b);
    const OrdinaryF108 = householdOrdinaryF108.reduce((a, b) => a + b);
    const SingleM108 = householdSingleM108.reduce((a, b) => a + b);
    const SingleF108 = householdSingleF108.reduce((a, b) => a + b);
    setHouseholdOrd108({
      OrdinaryM108: OrdinaryM108,
      OrdinaryF108: OrdinaryF108,
    });
    setHouseholdSingle108({
      SingleM108: SingleM108,
      SingleF108: SingleF108,
    });
  }

  //選出鄉里
  function areaSelection(e) {
    setVillag([]);
    let area = e.target.value;
    if (e.target.value === "所有行政區") {
      area = e.target.previousSibling.value;
    }
    // setAreaValue(area)
    const villagSelection = data.filter((v, i) => {
      return v.site_id.includes(area);
    });
    // console.log(villagSelection)
    const administrative108 = data108.filter((v, i) => {
      return v.site_id.includes(area);
    });

    const villagList = [];
    villagSelection.forEach((e) => {
      villagList.push(e.village);
    });
    setVillag(villagList);
    e.target.nextSibling.value = "所有鄉里";
    // console.log(villagList)
    const householdOrdinaryM = [];
    const householdOrdinaryF = [];
    const householdSingleM = [];
    const householdSingleF = [];
    villagSelection.map((v) => {
      householdOrdinaryM.push(+v.household_ordinary_m); //共同生活戶_男
      householdOrdinaryF.push(+v.household_ordinary_f); //共同生活戶_女
      householdSingleM.push(+v.household_single_m); //單獨生活戶_男
      householdSingleF.push(+v.household_single_f); //單獨生活戶_女
    });
    const OrdinaryM = householdOrdinaryM.reduce((a, b) => a + b);
    const OrdinaryF = householdOrdinaryF.reduce((a, b) => a + b);
    const SingleM = householdSingleM.reduce((a, b) => a + b);
    const SingleF = householdSingleF.reduce((a, b) => a + b);

    setHouseholdOrd({
      OrdinaryM: OrdinaryM,
      OrdinaryF: OrdinaryF,
    });
    setHouseholdSingle({
      SingleM: SingleM,
      SingleF: SingleF,
    });

    //108年資料
    const householdOrdinaryM108 = [];
    const householdOrdinaryF108 = [];
    const householdSingleM108 = [];
    const householdSingleF108 = [];
    administrative108.map((v) => {
      householdOrdinaryM108.push(+v.household_ordinary_m); //共同生活戶_男
      householdOrdinaryF108.push(+v.household_ordinary_f); //共同生活戶_女
      householdSingleM108.push(+v.household_single_m); //單獨生活戶_男
      householdSingleF108.push(+v.household_single_f); //單獨生活戶_女
    });
    //取總數
    const OrdinaryM108 = householdOrdinaryM108.reduce((a, b) => a + b);
    const OrdinaryF108 = householdOrdinaryF108.reduce((a, b) => a + b);
    const SingleM108 = householdSingleM108.reduce((a, b) => a + b);
    const SingleF108 = householdSingleF108.reduce((a, b) => a + b);
    setHouseholdOrd108({
      OrdinaryM108: OrdinaryM108,
      OrdinaryF108: OrdinaryF108,
    });
    setHouseholdSingle108({
      SingleM108: SingleM108,
      SingleF108: SingleF108,
    });
  }

  function villagSelection(e) {
    let village = e.target.value;
    let villageSelection = 0;
    let villageSelection108 = 0;
    if (e.target.value === "所有鄉里") {
      village = e.target.previousSibling.value;
      villageSelection = data.filter((v, i) => {
        return v.site_id.includes(village);
      });
      villageSelection108 = data108.filter((v, i) => {
        return v.site_id.includes(village);
      });
    } else {
      villageSelection = data.filter((v, i) => {
        return v.village.includes(village);
      });
      villageSelection108 = data108.filter((v, i) => {
        return v.village.includes(village);
      });
    }
    //  console.log(village)
    const householdOrdinaryM = [];
    const householdOrdinaryF = [];
    const householdSingleM = [];
    const householdSingleF = [];
    villageSelection.map((v) => {
      householdOrdinaryM.push(+v.household_ordinary_m); //共同生活戶_男
      householdOrdinaryF.push(+v.household_ordinary_f); //共同生活戶_女
      householdSingleM.push(+v.household_single_m); //單獨生活戶_男
      householdSingleF.push(+v.household_single_f); //單獨生活戶_女
    });
    const OrdinaryM = householdOrdinaryM.reduce((a, b) => a + b);
    const OrdinaryF = householdOrdinaryF.reduce((a, b) => a + b);
    const SingleM = householdSingleM.reduce((a, b) => a + b);
    const SingleF = householdSingleF.reduce((a, b) => a + b);

    setHouseholdOrd({
      OrdinaryM: OrdinaryM,
      OrdinaryF: OrdinaryF,
    });
    setHouseholdSingle({
      SingleM: SingleM,
      SingleF: SingleF,
    });

     //108年資料
     const householdOrdinaryM108 = [];
     const householdOrdinaryF108 = [];
     const householdSingleM108 = [];
     const householdSingleF108 = [];
     villageSelection108.map((v) => {
       householdOrdinaryM108.push(+v.household_ordinary_m); //共同生活戶_男
       householdOrdinaryF108.push(+v.household_ordinary_f); //共同生活戶_女
       householdSingleM108.push(+v.household_single_m); //單獨生活戶_男
       householdSingleF108.push(+v.household_single_f); //單獨生活戶_女
     });
     //取總數
     const OrdinaryM108 = householdOrdinaryM108.reduce((a, b) => a + b);
     const OrdinaryF108 = householdOrdinaryF108.reduce((a, b) => a + b);
     const SingleM108 = householdSingleM108.reduce((a, b) => a + b);
     const SingleF108 = householdSingleF108.reduce((a, b) => a + b);
     setHouseholdOrd108({
       OrdinaryM108: OrdinaryM108,
       OrdinaryF108: OrdinaryF108,
     });
     setHouseholdSingle108({
       SingleM108: SingleM108,
       SingleF108: SingleF108,
     });
  }

  return (
    <>
      <div className="frame">
        <div className="round">
          <img src="./taipeilogo.png" alt="" />
        </div>
        <h1>110年人口戶數及調查</h1>
      </div>
      <div className="content">
        <select onChange={(e) => districtSelection(e)}>
          <option>請選擇縣市</option>
          {siteId.map((v, i) => {
            return <option key={i}>{v}</option>;
          })}
        </select>
        <select onChange={(e) => areaSelection(e)}>
          <option defaultValue="請選擇行政區">請選擇行政區</option>
          <option>所有行政區</option>
          {areaHandler.map((v, i) => {
            return <option key={i}>{v}</option>;
          })}
        </select>
        <select onChange={(e) => villagSelection(e)}>
          <option defaultValue="請選擇鄉里">請選擇鄉里</option>
          <option>所有鄉里</option>
          {villag.map((v, i) => {
            return <option key={i}>{v}</option>;
          })}
        </select>
        <div className="chart">
          <Chart options={options} data={dataChart} />
        </div>
      </div>
    </>
  );
}

export default App;
