package com.yn520.money.service.impl;

import com.yn520.money.mapper.teacher.TeacherMapper;
import com.yn520.money.pojo.Teacher;
import com.yn520.money.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TeacherServiceImpl implements TeacherService {

    @Autowired
    public TeacherMapper teacherMapper;

    @Transactional(propagation = Propagation.SUPPORTS)
    @Override
    public Teacher getTeacherInfo(int id) {
        return teacherMapper.selectByPrimaryKey(id);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    @Override
    public void saveTeacher() {

        Teacher teacher = new Teacher();
        teacher.setName("teacher-jack");
        teacher.setAge(39);
        teacherMapper.insert(teacher);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    @Override
    public void updateTeacher(int id) {

        Teacher teacher = new Teacher();
        teacher.setId(id);
        teacher.setName("lucy");
        teacher.setAge(20);
        teacherMapper.updateByPrimaryKey(teacher);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    @Override
    public void deleteTeacher(int id) {
        teacherMapper.deleteByPrimaryKey(id);
    }


    public void saveParent() {
        Teacher teacher = new Teacher();
        teacher.setName("parent");
        teacher.setAge(19);
        teacherMapper.insert(teacher);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void saveChildren() {
        saveChild1();
        int a = 1 / 0;
        saveChild2();
    }

    public void saveChild1() {
        Teacher teacher1 = new Teacher();
        teacher1.setName("child-1");
        teacher1.setAge(11);
        teacherMapper.insert(teacher1);
    }

    public void saveChild2() {
        Teacher teacher2 = new Teacher();
        teacher2.setName("child-2");
        teacher2.setAge(22);
        teacherMapper.insert(teacher2);
    }
}
