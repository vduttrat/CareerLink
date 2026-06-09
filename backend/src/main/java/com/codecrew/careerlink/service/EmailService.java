package com.codecrew.careerlink.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String fullName) {
        if (toEmail == null || toEmail.trim().isEmpty()) {
            logger.warn("Attempted to send welcome email to an empty or null email address for user: {}", fullName);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Welcome to Career Link");

            String htmlContent = "<h2>Welcome to Career Link, " + fullName + "!</h2>" +
                    "<p>We're excited to have you join our professional career development platform.</p>" +
                    "<p>You can now:</p>" +
                    "<ul>" +
                    "<li>Explore job opportunities</li>" +
                    "<li>Build your professional profile</li>" +
                    "<li>Connect with employers</li>" +
                    "<li>Track applications</li>" +
                    "</ul>" +
                    "<p>Thank you for choosing Career Link.</p>" +
                    "<br><p>Best Regards,</p>" +
                    "<p><b>Career Link Team</b></p>";

            helper.setText(htmlContent, true); // Set to true to send HTML content
            mailSender.send(message);

            logger.info("Welcome email successfully sent to {}", toEmail);

        } catch (MessagingException e) {
            logger.error("Failed to send welcome email to {}", toEmail, e);
        }
    }
}
