/**
 *
 * User enters number of hrs worked for each employee in a popup box
 * Pay is $15 per hour for up to 40 hours, plus $22.50 per hour for hours over 40
 * Number of employees can vary and is user controlled. User enters -1 to signal no more employees
 * Program prints 3 col table:
 * Col 1: Employee index
 * Col 2: Number of hrs worked (entered by user)
 * Col 3: Employee's pay
 *
 *
 */

// Loop for user input
let employeeHrs = [];
let userInput;
let employeeNum = 1;
while (userInput != "-1") {
  userInput = prompt("Enter number of hrs for employee " + employeeNum);
  console.log(userInput);
  // prevent first value being -1
  while (employeeNum == 1 && userInput == "-1") {
    alert("You must have at least one employee.");
    userInput = prompt("Enter number of hrs for employee " + employeeNum);
  }

  if (userInput != "-1" && userInput != null && userInput != "") {
    employeeHrs.push(userInput);
    console.log("Added employee " + employeeNum + " to the list");
    employeeNum++;
  } else {
    continue;
  }
}

// Grab table
let table = document.querySelector("#payroll-table");
let tableBody = document.querySelector("#payroll-table-body");

// Add data to table
let totalPay = 0;
employeeHrs.forEach((hr, index) => {
  let row = document.createElement("tr");
  let idx = document.createElement("td");
  let employeeHr = document.createElement("td");
  let pay = document.createElement("td");
  idx.innerHTML = index + 1;
  employeeHr.innerHTML = hr;

  // calculate pay
  let employeePay;
  if (hr <= 40) {
    employeePay = 15 * hr;
    totalPay += employeePay;
    employeePay = (Math.round(employeePay * 100) / 100).toFixed(2);
  } else if (hr >= 40) {
    employeePay = 15 * 40 + (hr - 40) * 22.5;
    totalPay += employeePay;
    employeePay = (Math.round(employeePay * 100) / 100).toFixed(2);
  }

  pay.innerHTML = "$" + employeePay;

  row.appendChild(idx);
  row.appendChild(employeeHr);
  row.appendChild(pay);
  tableBody.appendChild(row);
  console.log("Added row to table");
});

// add total pay to summary
totalPay = (Math.round(totalPay * 100) / 100).toFixed(2);
document.querySelector(".summary").textContent += " $" + totalPay;
