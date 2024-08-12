"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import {UserFormValidation} from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"

export enum FormFieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',
}

const  PatientForm = () => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
        name: "",
        email: "",
        phone: "",
    },
})

    async function onSubmit({name,email,phone}: z.infer<typeof UserFormValidation>) {
        setIsLoading(true);

        try {
            const userData = { name, email, phone };

            const user =  await createUser(userData);

            if(user) router.push(`/patients/${user.$id}/register`);

        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    }

    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-4">
                    <h1 className="header">Hit there 👋</h1>
                    <p className="text-dark-700">Schedule your first appointment.</p>
                </section>

                {/* Name Input Start */}
                <CustomFormField
                    fieldType = {FormFieldType.INPUT}
                    control = {form.control}
                    name = "name"
                    label = "Full name"
                    placeholder = "Kawser Ahmed"
                    iconSrc = "/assets/icons/user.svg"
                    iconAlt = "user"
                />
                {/* Name Input End */}

                {/* Email Input Start */}
                <CustomFormField
                    fieldType = {FormFieldType.INPUT}
                    control = {form.control}
                    name = "email"
                    label = "Email"
                    placeholder = "kawser.ahmed@hotmail.com"
                    iconSrc = "/assets/icons/email.svg"
                    iconAlt = "email"
                />
                {/* Email Input End */}

                {/* Phone Input Start */}
                <CustomFormField
                    fieldType = {FormFieldType.PHONE_INPUT}
                    control = {form.control}
                    name = "phone"
                    label = "Phone number"
                    placeholder = "(555) 123-4567"
                />
                {/* Phone Input End */}

                {/* Button Input Start */}
                <SubmitButton isLoading = {isLoading}>
                    Get Started
                </SubmitButton>
                {/* Button Input End */}

            </form>
        </Form>
    )
}
export default PatientForm