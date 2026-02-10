import { HttpStatus } from '@nestjs/common';
import { AppError, type HttpErrorObject } from '@/exception/AppError';

export type ServiceErrorType = 'UNAVAILABLE' | 'NOT_IMPLEMENTED' | 'INTERNAL_ERROR';

export class ServiceError extends AppError {
	public readonly error: ServiceErrorType;

	public constructor(error: ServiceErrorType = 'INTERNAL_ERROR') {
		super('Service error');
		this.error = error;
	}

	public override getHttpStatus(): HttpStatus {
		switch (this.error) {
			case 'NOT_IMPLEMENTED':
				return HttpStatus.NOT_IMPLEMENTED;
			case 'UNAVAILABLE':
				return HttpStatus.SERVICE_UNAVAILABLE;
			case 'INTERNAL_ERROR':
			default:
				return HttpStatus.INTERNAL_SERVER_ERROR;
		}
	}

	public override httpErrorObject(): HttpErrorObject {
		return {
			status: this.getHttpStatus(),
			error: this.error,
			message: this.message,
		};
	}
}
