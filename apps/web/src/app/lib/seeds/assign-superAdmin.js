"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSuperAdmin = seedSuperAdmin;
// src/lib/seeds/seedSuperAdmin.ts
var time_1 = require("@/src/lib/utils/time");
var client_1 = require("@prisma/client");
var bcryptjs_1 = require("bcryptjs");
var crypto_1 = require("crypto");
// import nodemailer from "nodemailer"; // future email feature
var SUPER_ADMIN_EMAIL = "super@system.com";
var SUPER_ADMIN_NAME = "System Super Admin";
var SALT_ROUNDS = 10;
var PEPPER = process.env.PASSWORD_PEPPER || "";
var prisma = new client_1.PrismaClient();
function generateStrongPassword(length) {
    if (length === void 0) { length = 16; }
    return crypto_1.default.randomBytes(length).toString("base64").slice(0, length);
}
var superAdminRole = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: { name: "SUPER_ADMIN", isSystemRole: true },
});
/*
// Future email feature
async function sendTempPasswordEmail(to: string, password: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: !!process.env.SMTP_SECURE,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: '"System" <no-reply@yourdomain.com>',
    to,
    subject: "Super Admin temporary password",
    text: `Temporary password: ${password}\nPlease change it immediately.`,
  });
}
*/
function seedSuperAdmin() {
    return __awaiter(this, void 0, void 0, function () {
        var superAdminRole_1, password, hashedPassword, superAdminUser, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 8]);
                    return [4 /*yield*/, prisma.role.upsert({
                            where: { name: "SUPER_ADMIN" },
                            update: {},
                            create: {
                                name: "SUPER_ADMIN",
                                isSystemRole: true,
                            },
                        })];
                case 1:
                    superAdminRole_1 = _a.sent();
                    console.log("✅ SUPER_ADMIN role initialized");
                    password = generateStrongPassword();
                    return [4 /*yield*/, bcryptjs_1.default.hash(password + PEPPER, SALT_ROUNDS)];
                case 2:
                    hashedPassword = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: SUPER_ADMIN_EMAIL },
                            update: { password: hashedPassword },
                            create: {
                                name: SUPER_ADMIN_NAME,
                                email: SUPER_ADMIN_EMAIL,
                                password: hashedPassword,
                                createdAt: (0, time_1.nowTimestamp)(),
                                updatedAt: (0, time_1.nowTimestamp)(),
                            },
                        })];
                case 3:
                    superAdminUser = _a.sent();
                    console.log("✅ Super Admin user initialized");
                    // 4️⃣ Assign SUPER_ADMIN role to the user
                    return [4 /*yield*/, prisma.userRole.upsert({
                            where: {
                                userId_roleId: { userId: superAdminUser.id, roleId: superAdminRole_1.id },
                            },
                            update: {},
                            create: { userId: superAdminUser.id, roleId: superAdminRole_1.id },
                        })];
                case 4:
                    // 4️⃣ Assign SUPER_ADMIN role to the user
                    _a.sent();
                    console.log("\u2705 ".concat(SUPER_ADMIN_EMAIL, " assigned as SUPER_ADMIN"));
                    // 5️⃣ Console log the temporary password for dev/testing
                    console.log("🛡️ Super Admin temporary password (development only):", password);
                    console.log("⚠️ Make sure to change it immediately after first login!");
                    // 6️⃣ Future email feature (commented out for now)
                    // await sendTempPasswordEmail(SUPER_ADMIN_EMAIL, password);
                    console.log("🎉 Seeding complete!");
                    return [3 /*break*/, 8];
                case 5:
                    err_1 = _a.sent();
                    console.error("❌ Failed to seed Super Admin:", err_1);
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, prisma.$disconnect()];
                case 7:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Execute directly if running as a script
if (require.main === module) {
    seedSuperAdmin();
}
