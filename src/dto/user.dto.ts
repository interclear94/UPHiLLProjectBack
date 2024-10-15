import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
const nickNameRegex = /^[a-zA-Z가-힣0-9]{1,5}$/;
const userNameRegex = /^[a-zA-Z가-힣\s-]{2,10}$/;
const phoneNumberRegex = /^01([0|1|6|7|8|9])-([0-9]{3,4})-([0-9]{4})$/;

export const signupSchema = z.object({
    email: z.string().regex(emailRegex),
    userName: z.string().regex(userNameRegex),
    nickName: z.string().regex(nickNameRegex),
    birthDate: z.date(),
    phoneNumber: z.string().regex(phoneNumberRegex),
    password: z.string().regex(passwordRegex),
    checkPassword: z.string().regex(passwordRegex)
})

export const signinSchema = z.object({
    email: z.string().regex(emailRegex),
    password: z.string().regex(passwordRegex)
})

export const duplication = z.object({
    email: z.string().regex(emailRegex).nullable(),
    nickName: z.string().regex(nickNameRegex).nullable()
})

export const findidSchema = z.object({
    phoneNumber: z.string().regex(phoneNumberRegex)
})

export const findpwSchema = z.object({
    email: z.string().regex(emailRegex)
})

export const updatePwSchema = z.object({
    email: z.string().regex(emailRegex),
    password: z.string().regex(passwordRegex)
})

export const deleteSchema = z.object({
    token: z.string()
})