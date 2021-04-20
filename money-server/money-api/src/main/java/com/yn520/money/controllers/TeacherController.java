package com.yn520.money.controllers;

import com.yn520.money.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

//@Controller
@ApiIgnore
@RestController
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @GetMapping("/getTeacher")
    public Object getTeacher(int id) {
        return teacherService.getTeacherInfo(id);
    }

    @PostMapping("/saveTeacher")
    public Object saveTeacher() {
        teacherService.saveTeacher();
        return "OK";
    }

    @PostMapping("/updateTeacher")
    public Object updateTeacher(int id) {
        teacherService.updateTeacher(id);
        return "OK";
    }

    @PostMapping("/deleteTeacher")
    public Object deleteTeacher(int id) {
        teacherService.deleteTeacher(id);
        return "OK";
    }

}
