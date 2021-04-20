package com.yn520.money.service;

import com.yn520.money.pojo.Teacher;

public interface TeacherService {

    public Teacher getTeacherInfo(int id);

    public void saveTeacher();

    public void updateTeacher(int id);

    public void deleteTeacher(int id);

    public void saveParent();
    public void saveChildren();
}
