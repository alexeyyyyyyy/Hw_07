import {EmployeeService} from './EmployeeService';
import Employee from "../models/Employee";
import EmployeeRepository from "../dao/EmployeeRepository";

export class EmployeeServiceImpl implements EmployeeService {
    private employees: Employee[] = [];
    private employeeRepository: EmployeeRepository = new EmployeeRepository();

    getAllEmployees(): Employee[] {
        return this.employees;
    }

    addEmployee(employee: Employee): boolean {
        if(this.employees.findIndex(elem => elem.id === employee.id) === -1){
            this.employees.push(employee);
            this.employeeRepository.write(employee);
            return true;
        }
        return false;
    }

    deleteEmployee(id: number): Employee | null {
        const index = this.employees.findIndex(elem => elem.id === id);
        const victim = this.employees.at(index) as Employee;
        if(index === -1) {
            return null;
        }

        this.employees.splice(index, 1)
        this.employeeRepository.writeAll(...this.employees);
        return victim;
    }

    async loadEmployees(): Promise<void> {
        try {
            this.employees = await this.employeeRepository.readAll();
        } catch (error) {
            console.error("Error of Loading employees from file:", error);
        }
    }
}
