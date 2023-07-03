import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.model';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async generateJwtToken(user: User): Promise<string> {
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.signAsync(payload);
  }

  async login(username: string, pass: string): Promise<LoginResponseDto> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new HttpException('Invalid username', HttpStatus.FORBIDDEN);
    }
    const pwdOk = await bcrypt.compare(pass, user?.password);
    if (!pwdOk) {
      throw new HttpException('Invalid password', HttpStatus.FORBIDDEN);
    }
    return new LoginResponseDto(await this.generateJwtToken(user));
  }

  async signUp(username: string, pass: string): Promise<LoginResponseDto> {
    const existingUser = await this.userService.findByUsername(username, true);
    if (existingUser) {
      throw new HttpException(
        'Provided username is already taken.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const newUser = new User({
      username: username.trim().toLowerCase(),
      password: await bcrypt.hash(pass, 12),
    });
    const res = await newUser.save();
    if (res?.id == null) {
      throw new HttpException(
        'There was an error during sign-up process',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return new LoginResponseDto(await this.generateJwtToken(newUser));
  }
}
