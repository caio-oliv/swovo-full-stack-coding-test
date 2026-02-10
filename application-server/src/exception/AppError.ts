import { HttpStatus } from '@nestjs/common';
import type { Request, Response } from '@/types/http';

export interface HttpErrorObject extends Record<string, unknown> {
	status: number;
	error: string;
	message: string;
}

export interface HttpBaseError {
	/**
	 * Write the HTTP error into the response.
	 *
	 * @param {Readonly<Request>} request Readonly request
	 * @param {Response} response Response which the error will be written
	 */
	toHttp(request: Readonly<Request>, response: Response): void;

	getHttpStatus(): HttpStatus;
	httpErrorObject(): HttpErrorObject;
}

export class AppError extends Error implements HttpBaseError {
	// eslint-disable-next-line @typescript-eslint/class-methods-use-this
	public getHttpStatus(): HttpStatus {
		return HttpStatus.INTERNAL_SERVER_ERROR;
	}

	// eslint-disable-next-line @typescript-eslint/class-methods-use-this
	public httpErrorObject(): HttpErrorObject {
		return {
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			error: 'INTERNAL_ERROR',
			message: 'Server encountered an error processing the request',
		};
	}

	public toHttp(_: Readonly<Request>, response: Response): void {
		const data = this.httpErrorObject();
		response.statusCode = this.getHttpStatus();
		response.send(data);
	}
}
