import * as fs from "node:fs";
import {NoParamCallback, ObjectEncodingOptions, PathOrFileDescriptor, WriteFileOptions} from "node:fs";
import {Abortable} from "node:events";
import Employee from "../models/Employee";

export default class EmployeeRepository {
    private readonly fsReadable:{
        (path: PathOrFileDescriptor, options: (({
            encoding?: null | undefined;
            flag?: string | undefined
        } & Abortable) | undefined | null), callback: (err: (NodeJS.ErrnoException | null), data: Buffer) => void): void;
        (path: PathOrFileDescriptor, options: (({
            encoding: BufferEncoding;
            flag?: string | undefined
        } & Abortable) | BufferEncoding), callback: (err: (NodeJS.ErrnoException | null), data: string) => void): void;
        (path: PathOrFileDescriptor, options: ((ObjectEncodingOptions & {
            flag?: string | undefined
        } & Abortable) | BufferEncoding | undefined | null), callback: (err: (NodeJS.ErrnoException | null), data: (string | Buffer)) => void): void;
        (path: PathOrFileDescriptor, callback: (err: (NodeJS.ErrnoException | null), data: Buffer) => void): void
    } ;
    private readonly fsWritable:{
        (file: PathOrFileDescriptor, data: (string | NodeJS.ArrayBufferView), options: WriteFileOptions, callback: NoParamCallback): void;
        (path: PathOrFileDescriptor, data: (string | NodeJS.ArrayBufferView), callback: NoParamCallback): void
    } ;

    constructor() {
    this.fsReadable = fs.readFile;
    this.fsWritable = fs.writeFile;
    }

    readAll(): Promise<Employee[]> {
        return new Promise((resolve, reject) => {
            this.fsReadable("db.txt", "utf-8", (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    try {
                        const employees = JSON.parse(data) as Employee[];
                        resolve(employees);
                    } catch (parseError) {
                        reject(parseError);
                    }
                }
            });
        });
    }


    async write(employee: Employee): Promise<void> {
        const employees = await this.readAll();
        employees.push(employee);
        return await new Promise<void>((resolve, reject) => {
            this.fsWritable("db.txt", JSON.stringify(employees, null, 2), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }


    writeAll(...employees: Employee[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.fsWritable("db.txt", JSON.stringify(employees, null, 2), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}