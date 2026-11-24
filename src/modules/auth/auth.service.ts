import bcrypt from 'bcrypt';
import prisma from '../../config/database';
import { generateToken } from '../../utils/jwt';
import { AppError } from '../../middleware/errorHandler';
import { HTTP_STATUS } from '../../config/constants';
import { LoginInput, LoginResponseData, CurrentUserProfile } from './auth.types';

export class AuthService {
  async login(input: LoginInput): Promise<LoginResponseData> {
    const inputClean = input.email.trim();
    const emailNormalized = inputClean.toLowerCase();
    const cleanPassword = (input.password || '').trim();

    // Find user by email (Google OAuth / login identity)
    let user = await prisma.user.findUnique({
      where: { email: emailNormalized },
      include: {
        role: true,
        staffProfile: true,
      },
    });

    // Auto-provision demo/dev users if missing
    if (!user && (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV)) {
      const defaultRole = await prisma.role.findFirst({ where: { name: 'MANAGER' } });
      if (defaultRole) {
        const hash = await bcrypt.hash('123456', 10);
        user = await prisma.user.create({
          data: {
            email: emailNormalized,
            passwordHash: hash,
            roleId: defaultRole.id,
            isActive: true,
            staffProfile: {
              create: {
                name: emailNormalized.split('@')[0],
                phone: '+237600000000',
              },
            },
          },
          include: {
            role: true,
            staffProfile: true,
          },
        });
      }
    }

    if (!user) {
      throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
    }

    // Check isActive status
    if (!user.isActive) {
      throw new AppError('Account is deactivated. Please contact manager.', HTTP_STATUS.FORBIDDEN);
    }

    // Compare password using bcrypt — accepts hash or dev master passwords 'password' / '123456'
    let isPasswordValid = await bcrypt.compare(cleanPassword, user.passwordHash);
    if (!isPasswordValid && (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV)) {
      if (cleanPassword === 'password' || cleanPassword === '123456') {
        isPasswordValid = true;
      }
    }

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
    }

    // Extract and normalize specialties for session context
    let specialties: string[] = [];
    if (user.staffProfile?.specialties) {
      if (Array.isArray(user.staffProfile.specialties)) {
        specialties = user.staffProfile.specialties as string[];
      } else if (typeof user.staffProfile.specialties === 'string') {
        try {
          specialties = JSON.parse(user.staffProfile.specialties);
        } catch {
          specialties = [];
        }
      }
      specialties = specialties.map((s) => (s === 'Massage' ? 'Body Massage' : s));
    }

    let roleName = user.role.name;
    if (roleName === 'MARKETER' || specialties.some((s) => s.toLowerCase() === 'marketer')) {
      roleName = 'MARKETER' as any;
      if (!specialties.some((s) => s.toLowerCase() === 'marketer')) {
        specialties.push('Marketer');
      }
    }

    // Generate JWT token with resolved role
    const token = generateToken({
      userId: user.id,
      role: roleName,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone || user.staffProfile?.phone || null,
        role: roleName,
        name: user.staffProfile?.name || roleName,
        specialties,
      },
    };
  }

  async getCurrentUser(userId: string): Promise<CurrentUserProfile> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        staffProfile: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', HTTP_STATUS.FORBIDDEN);
    }

    let specialties: string[] = [];
    if (user.staffProfile?.specialties) {
      if (Array.isArray(user.staffProfile.specialties)) {
        specialties = user.staffProfile.specialties as string[];
      } else if (typeof user.staffProfile.specialties === 'string') {
        try {
          specialties = JSON.parse(user.staffProfile.specialties);
        } catch {
          specialties = [];
        }
      }
      specialties = specialties.map((s) => (s === 'Massage' ? 'Body Massage' : s));
    }

    let roleName = user.role.name;
    if (roleName === 'MARKETER' || specialties.some((s) => s.toLowerCase() === 'marketer')) {
      roleName = 'MARKETER' as any;
      if (!specialties.some((s) => s.toLowerCase() === 'marketer')) {
        specialties.push('Marketer');
      }
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone || user.staffProfile?.phone || null,
      role: roleName,
      staffProfile: user.staffProfile
        ? {
            id: user.staffProfile.id,
            name: user.staffProfile.name,
            phone: user.staffProfile.phone || user.phone,
            specialties,
          }
        : null,
    };
  }
}

export const authService = new AuthService();
