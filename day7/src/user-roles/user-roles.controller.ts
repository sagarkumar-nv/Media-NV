import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/roles/roles.guard';
import { Role } from '../guards/roles/role.enums';
import { Roles } from '../guards/roles/role.decorator'

@Controller('user-roles')
export class UserRolesController {
    @Get('admin-data')
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)          //Role-Based Authentication
    getAdminData() {
        return { message: 'Only admin can access. '}
    }
    @Get('user-data')
    getUserData() {
        return { message: 'Anyone can access.'}
    }
}
