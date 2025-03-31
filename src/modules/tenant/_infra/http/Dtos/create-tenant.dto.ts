import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsCNPJ } from 'src/_utils/validators/is-cnpj.decorator';

export default class CreateTenantDto {
    @ApiProperty({ description: 'Tenant name', example: 'Sorvete amigo' })
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    @Length(3, 100)
    name: string;

    @ApiProperty({ description: 'Business segment', example: 'Vestuário' })
    @IsString()
    @IsNotEmpty({ message: 'Segment is required' })
    @Length(3, 50)
    segment: string;

    @ApiProperty({ description: 'Business   CNPJ', example: '00.000.000/0001-00' })
    @IsString()
    @IsNotEmpty({ message: 'CNPJ é obrigatório' })
    @IsCNPJ({ message: 'CNPJ inválido' })
    cnpj: string;
}
