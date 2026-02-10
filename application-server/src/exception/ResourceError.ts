import { HttpStatus } from '@nestjs/common';
import { AppError, type HttpErrorObject } from '@/exception/AppError';

export type ResourceErrorType = 'NOT_FOUND' | 'ALREADY_EXISTS' | 'CONFLICT';

export interface ResourceLocation {
	resource: string;
	key: string;
	path: string | null;
}

export class ResourceError extends AppError {
	public readonly error: ResourceErrorType;
	public readonly location: ResourceLocation;

	public constructor(error: ResourceErrorType, location: ResourceLocation) {
		super('Resource error');
		this.error = error;
		this.location = location;
	}

	public override getHttpStatus(): HttpStatus {
		switch (this.error) {
			case 'NOT_FOUND':
				return HttpStatus.NOT_FOUND;
			case 'ALREADY_EXISTS':
			case 'CONFLICT':
				return HttpStatus.CONFLICT;
			default:
				return HttpStatus.BAD_REQUEST;
		}
	}

	public override httpErrorObject(): HttpErrorObject {
		return {
			status: this.getHttpStatus(),
			error: this.error,
			message: this.message,
			location: this.location,
		};
	}
}
