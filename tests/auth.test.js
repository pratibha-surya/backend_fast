import { jest } from "@jest/globals";
import User from "../models/User.js";
import OTP from "../models/OTP.js";
import * as authService from "../services/auth.service.js";
import ApiError from "../utils/ApiError.js";
import sendEmail from "../utils/sendEmail.js";

// Mock sendEmail
jest.unstable_mockModule("../utils/sendEmail.js", () => ({
  default: jest.fn().mockResolvedValue(true),
}));

describe("Auth Service Tests", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("sendRegisterOTP", () => {
    it("should send an OTP if the user does not exist", async () => {
      // Mock User.findOne to return null (user doesn't exist)
      jest.spyOn(User, "findOne").mockResolvedValue(null);
      // Mock OTP.findOneAndUpdate to resolve successfully
      jest.spyOn(OTP, "findOneAndUpdate").mockResolvedValue({});

      const result = await authService.sendRegisterOTP({ email: "test@example.com" });
      expect(result).toBe(true);
      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(OTP.findOneAndUpdate).toHaveBeenCalled();
    });

    it("should throw a 409 error if email already exists", async () => {
      // Mock User.findOne to return an existing user
      jest.spyOn(User, "findOne").mockResolvedValue({ email: "test@example.com" });

      await expect(
        authService.sendRegisterOTP({ email: "test@example.com" })
      ).rejects.toThrow(ApiError);
    });
  });

  describe("register", () => {
    it("should register an admin user immediately with isVerified=true", async () => {
      jest.spyOn(User, "findOne").mockResolvedValue(null);
      jest.spyOn(User, "create").mockResolvedValue({
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        isVerified: true,
      });

      const user = await authService.register({
        name: "Admin User",
        email: "admin@example.com",
        password: "Password123!",
        role: "admin",
      });

      expect(user.isVerified).toBe(true);
      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          role: "admin",
          isVerified: true,
        })
      );
    });

    it("should throw an error for standard user registration if OTP is not verified", async () => {
      jest.spyOn(User, "findOne").mockResolvedValue(null);
      jest.spyOn(OTP, "findOne").mockResolvedValue(null); // No verified OTP

      await expect(
        authService.register({
          name: "Standard User",
          email: "user@example.com",
          password: "Password123!",
          role: "user",
        })
      ).rejects.toThrow(ApiError);
    });

    it("should register standard user if OTP is verified", async () => {
      jest.spyOn(User, "findOne").mockResolvedValue(null);
      jest.spyOn(OTP, "findOne").mockResolvedValue({ email: "user@example.com", isVerified: true });
      jest.spyOn(OTP, "deleteMany").mockResolvedValue({});
      jest.spyOn(User, "create").mockResolvedValue({
        name: "Standard User",
        email: "user@example.com",
        role: "user",
        isVerified: true,
      });

      const user = await authService.register({
        name: "Standard User",
        email: "user@example.com",
        password: "Password123!",
        role: "user",
      });

      expect(user.isVerified).toBe(true);
      expect(OTP.deleteMany).toHaveBeenCalledWith({ email: "user@example.com", type: "REGISTER" });
      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          role: "user",
          isVerified: true,
        })
      );
    });
  });
});
