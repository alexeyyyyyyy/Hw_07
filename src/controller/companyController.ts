import {EmployeeService} from "../services/EmployeeService";
import Employee from "../models/Employee";
import {eventEmitter} from "../events/eventEmitter";

export default class CompanyController {
    private employeeService: EmployeeService;

    constructor(employeeService: EmployeeService) {
        this.employeeService = employeeService;
    }

    getAllEmployees (){
        return this.employeeService.getAllEmployees();
    }

    async addEmployee(employeeDto: unknown) {
        return this.employeeService.addEmployee(employeeDto as Employee);
    }

    async deleteEmployee(employeeDto: unknown) {
        const victim = this.employeeService.deleteEmployee((employeeDto as { id: number }).id)!;
        eventEmitter.emit('UserDeleted', victim.name);
        return victim;
    }
}