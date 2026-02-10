import { HttpStatus } from '@nestjs/common';
import { AppError, type HttpErrorObject } from '@/exception/AppError';
import type { UlidID } from '@/types/entity';

export type DoaminEntity = 'PRODUCT' | 'PRODUCT_BATCH' | 'FIXED_DIGIT' | 'PRECISE_NUMBER';

export interface DomainErrorDescription {
	entity: DoaminEntity;
	operation: string;
	message: string;
	id: UlidID | null;
}

export class DomainError extends AppError {
	public readonly error = 'DOMAIN';
	public readonly domain: DomainErrorDescription;

	public constructor(domain: DomainErrorDescription) {
		super('Domain error');
		this.domain = domain;
	}

	// eslint-disable-next-line @typescript-eslint/class-methods-use-this
	public override getHttpStatus(): HttpStatus {
		return HttpStatus.UNPROCESSABLE_ENTITY;
	}

	public override httpErrorObject(): HttpErrorObject {
		return {
			status: this.getHttpStatus(),
			error: this.error,
			message: this.message,
			domain: this.domain,
		};
	}
}
