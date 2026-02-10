import { readFile } from 'node:fs/promises';
import type { Knex } from 'knex';

const initUrl = new URL('./init_database.sql', import.meta.url);
const downUrl = new URL('./down_database.sql', import.meta.url);

export async function up(knex: Knex): Promise<void> {
	const sql = await readFile(initUrl.pathname, { encoding: 'utf-8' });
	await knex.schema.raw(sql);
}

export async function down(knex: Knex): Promise<void> {
	const sql = await readFile(downUrl.pathname, { encoding: 'utf-8' });
	await knex.schema.raw(sql);
}
