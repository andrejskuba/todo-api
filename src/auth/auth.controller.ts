import { Request, Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { UserService } from 'src/user/user.service';
import { UserDto } from 'src/user/dto/user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiResponse({ status: 403, description: 'Invalid username or password' })
  login(@Body() loginData: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginData.username, loginData.password);
  }

  @Public()
  @Post('sign-up')
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: SignUpDto })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Username taken' })
  signUp(@Body() signupData: SignUpDto) {
    return this.authService.signUp(signupData.username, signupData.password);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user details' })
  @ApiOkResponse({ type: UserDto })
  // @ApiResponse({ status: 500, description: 'Non-existing user' })
  async getProfile(@Request() req) {
    const user = await this.userService.getCurrentUser(req);
    return new UserDto(user);
  }
}
