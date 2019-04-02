import { Component } from "@angular/core";
import { ELEMENT_DATA, AllElectronics } from "./data";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "decision-tree";
  newAge: string;
  newIncome: string;
  newStudent: string;
  newCredit: string;
  newBuysComputer: string;
  added: boolean = false;
  yesCount: number = 0;
  noCount: number = 0;
  entropy: number;
  show: boolean = false;
  initalCalc: boolean = false;
  ageGain: number;
  incomeGain: number;
  studentGain: number;
  creditGain: number;
  splittingAttribute: string;
  decision_tree;

  displayedColumns: string[] = [
    "age",
    "income",
    "student",
    "credit_rating",
    "buys_computer"
  ];

  dataSource = ELEMENT_DATA;

  constructor() {}

  add() {
    const newElement: AllElectronics = {
      RID: 15,
      age: this.newAge,
      income: this.newIncome,
      student: this.newStudent,
      credit_rating: this.newCredit,
      buys_computer: this.newBuysComputer
    };
    ELEMENT_DATA.push(newElement);
    this.dataSource = [...ELEMENT_DATA];
    this.added = true;
  }

  clear() {
    if (this.added == true) {
      ELEMENT_DATA.splice(ELEMENT_DATA.length - 1, 1);
      this.dataSource = [...ELEMENT_DATA];
    }

    this.newAge = null;
    this.newIncome = null;
    this.newStudent = null;
    this.newCredit = null;
    this.newBuysComputer = null;
    this.added = false;
    this.yesCount = null;
    this.noCount = null;
    this.entropy = null;
    this.show = false;
    this.initalCalc = false;
    this.ageGain = null;
    this.incomeGain = null;
    this.studentGain = null;
    this.creditGain = null;
    this.splittingAttribute = null;
  }

  calcEntropy() {
    if (this.initalCalc == false) {
      this.show = true;
      for (let element of ELEMENT_DATA) {
        if (element.buys_computer == "no") {
          this.noCount += 1;
        } else if (element.buys_computer == "yes") {
          this.yesCount += 1;
        }
      }
      this.initalCalc = true;

      this.entropy = this.entropyHelper(this.noCount, this.yesCount);

      this.ageGain = this.calcAgeGain();
      this.incomeGain = this.calcIncomeGain();
      this.studentGain = this.calcStudentGain();
      this.creditGain = this.calcCreditRating();
      this.calcSplittingAttribute();
    }
  }

  // calculate the inital entropy on one attribute in this case the buys_computer
  entropyHelper(num1: number, num2: number) {
    let noEntropy = Number((num1 / ELEMENT_DATA.length).toFixed(2));
    let yesEntropy = Number((num2 / ELEMENT_DATA.length).toFixed(2));

    let entropy: number =
      -(noEntropy * Math.log2(noEntropy)) - yesEntropy * Math.log2(yesEntropy);

    entropy = Number(entropy.toFixed(2));

    return entropy;
  }

  // calculate the entropy of two attributes
  entropyHelper2(num1: number, num2: number) {
    if (num1 == 0 || num2 == 0) {
      return 0;
    } else {
      let noEntropy = Number((num1 / (num1 + num2)).toFixed(2));
      let yesEntropy = Number((num2 / (num1 + num2)).toFixed(2));

      let entropy: number =
        -(noEntropy * Math.log2(noEntropy)) -
        yesEntropy * Math.log2(yesEntropy);

      entropy = Number(entropy.toFixed(2));

      return entropy;
    }
  }

  calcAgeGain() {
    let yesYouth = 0;
    let noyouth = 0;
    let yesMiddle = 0;
    let noMiddle = 0;
    let yesSenior = 0;
    let noSenior = 0;

    for (let element of ELEMENT_DATA) {
      if (element.age == "youth" && element.buys_computer == "yes") {
        yesYouth += 1;
      } else if (element.age == "youth" && element.buys_computer == "no") {
        noyouth += 1;
      } else if (element.age == "middle" && element.buys_computer == "yes") {
        yesMiddle += 1;
      } else if (element.age == "middle" && element.buys_computer == "no") {
        noMiddle += 1;
      } else if (element.age == "senior" && element.buys_computer == "yes") {
        yesSenior += 1;
      } else if (element.age == "senior" && element.buys_computer == "no") {
        noSenior += 1;
      }
    }

    let youthEntropy = this.entropyHelper2(noyouth, yesYouth);
    let middleEntropy = this.entropyHelper2(noMiddle, yesMiddle);
    let seniorEntropy = this.entropyHelper2(noSenior, yesSenior);

    youthEntropy = ((noyouth + yesYouth) / ELEMENT_DATA.length) * youthEntropy;
    middleEntropy =
      ((noMiddle + yesMiddle) / ELEMENT_DATA.length) * middleEntropy;
    seniorEntropy =
      ((noSenior + yesSenior) / ELEMENT_DATA.length) * seniorEntropy;

    let ageEntropy = youthEntropy + middleEntropy + seniorEntropy;

    let ageGain = this.entropy - ageEntropy;
    ageGain = Number(ageGain.toFixed(3));

    return ageGain;
  }

  calcIncomeGain() {
    let yesLow = 0;
    let noLow = 0;
    let yesMedium = 0;
    let noMedium = 0;
    let yesHigh = 0;
    let noHigh = 0;

    for (let element of ELEMENT_DATA) {
      if (element.income == "low" && element.buys_computer == "yes") {
        yesLow += 1;
      } else if (element.income == "low" && element.buys_computer == "no") {
        noLow += 1;
      } else if (element.income == "medium" && element.buys_computer == "yes") {
        yesMedium += 1;
      } else if (element.income == "medium" && element.buys_computer == "no") {
        noMedium += 1;
      } else if (element.income == "high" && element.buys_computer == "yes") {
        yesHigh += 1;
      } else if (element.income == "high" && element.buys_computer == "no") {
        noHigh += 1;
      }
    }

    let lowEntropy = this.entropyHelper2(noLow, yesLow);
    let mediumEntropy = this.entropyHelper2(noMedium, yesMedium);
    let highEntropy = this.entropyHelper2(noHigh, yesHigh);

    lowEntropy = ((noLow + yesLow) / ELEMENT_DATA.length) * lowEntropy;
    mediumEntropy =
      ((noMedium + yesMedium) / ELEMENT_DATA.length) * mediumEntropy;
    highEntropy = ((noHigh + yesHigh) / ELEMENT_DATA.length) * highEntropy;

    let incomeEntropy = lowEntropy + mediumEntropy + highEntropy;

    let incomeGain = this.entropy - incomeEntropy;
    incomeGain = Number(incomeGain.toFixed(3));

    return incomeGain;
  }

  calcStudentGain() {
    let yesYesStudent = 0;
    let yesNoStudent = 0;
    let noYesStudent = 0;
    let noNoStudent = 0;

    for (let element of ELEMENT_DATA) {
      if (element.student == "yes" && element.buys_computer == "yes") {
        yesYesStudent += 1;
      } else if (element.student == "yes" && element.buys_computer == "no") {
        yesNoStudent += 1;
      } else if (element.student == "no" && element.buys_computer == "yes") {
        noYesStudent += 1;
      } else if (element.student == "no" && element.buys_computer == "no") {
        noNoStudent += 1;
      }
    }

    let noStudentEntropy = this.entropyHelper2(yesNoStudent, yesYesStudent);
    let yesStudentEntropy = this.entropyHelper2(noNoStudent, noYesStudent);

    noStudentEntropy =
      ((yesNoStudent + yesYesStudent) / ELEMENT_DATA.length) * noStudentEntropy;
    yesStudentEntropy =
      ((noNoStudent + noYesStudent) / ELEMENT_DATA.length) * yesStudentEntropy;

    let studentEntropy = noStudentEntropy + yesStudentEntropy;

    let studentGain = this.entropy - studentEntropy;
    studentGain = Number(studentGain.toFixed(3));

    return studentGain;
  }

  calcCreditRating() {
    let yesFair = 0;
    let noFair = 0;
    let yesExcellent = 0;
    let noExcellent = 0;

    for (let element of ELEMENT_DATA) {
      if (element.credit_rating == "fair" && element.buys_computer == "yes") {
        yesFair += 1;
      } else if (
        element.credit_rating == "fair" &&
        element.buys_computer == "no"
      ) {
        noFair += 1;
      } else if (
        element.credit_rating == "excellent" &&
        element.buys_computer == "yes"
      ) {
        yesExcellent += 1;
      } else if (
        element.credit_rating == "excellent" &&
        element.buys_computer == "no"
      ) {
        noExcellent += 1;
      }
    }

    let fairEntropy = this.entropyHelper2(noFair, yesFair);
    let excellentEntropy = this.entropyHelper2(noExcellent, yesExcellent);

    fairEntropy = ((noFair + yesFair) / ELEMENT_DATA.length) * fairEntropy;
    excellentEntropy =
      ((noExcellent + yesExcellent) / ELEMENT_DATA.length) * excellentEntropy;

    let creditEntropy = fairEntropy + excellentEntropy;

    let creditGain = this.entropy - creditEntropy;
    creditGain = Number(creditGain.toFixed(3));

    return creditGain;
  }

  calcSplittingAttribute() {
    let highestGain = Math.max(
      this.ageGain,
      this.incomeGain,
      this.studentGain,
      this.creditGain
    );

    let flag: string;

    if (highestGain == this.ageGain) {
      this.splittingAttribute = "age";
    } else if (highestGain == this.incomeGain) {
      this.splittingAttribute = "income";
    } else if (highestGain == this.studentGain) {
      this.splittingAttribute = "student";
    } else {
      this.splittingAttribute = "credit_rating";
    }

    const group = ELEMENT_DATA.reduce((tempArr, item) => {
      if (this.splittingAttribute == "age") {
        flag = item.age;
      } else if (this.splittingAttribute == "income") {
        flag = item.income;
      } else if (this.splittingAttribute == "student") {
        flag = item.student;
      } else {
        flag = item.credit_rating;
      }

      if (!tempArr[flag]) {
        tempArr[flag] = [];
      }

      tempArr[flag].push(item);
      return tempArr;
    }, {});

    this.decision_tree = group;
  }
}
