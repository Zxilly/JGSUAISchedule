function weekdayFix(day) {
    if (day === 1) {
        return 7
    }
    return day - 1
}

function weekParser(week) {
    const result = []
    const weeks = week.split(',')
    for (week of weeks) {
        week = week.trim()
        if (week.includes("单") || week.includes("双")) {
            week = week.substring(0, week.length - 2)
            let start, end
            [start, end] = week.split('-')
            for (let i = Number(start); i <= Number(end); i += 2) {
                result.push(i)
            }
        } else {
            let start, end
            [start, end] = week.split('-')
            for (let i = Number(start); i <= Number(end); i++) {
                result.push(i)
            }
        }
    }
    return result
}

function sum(arr) {
    let s = 0;
    for (let i = 0; i < arr.length; i++) {
        s += arr[i];
    }
    return s;
}

function scheduleHtmlParser(html) {

    const rawCourseObject = JSON.parse(html)['data']
    let rawCourses = []
    let sectionTimes = []

    for (const rawCourseObjectElement of rawCourseObject) {
        const time = rawCourseObjectElement['time']
        if (rawCourseObjectElement['week']['weekCode'] === '2') {
            const sector = {
                section: Number(time['timeCode']),
                startTime: time['startTime'],
                endTime: time['endTime']
            }
            sectionTimes.push(sector)
        }

        for (const rawCourse of rawCourseObjectElement['courseList']) {
            rawCourse['time'] = time
            rawCourse['dayOfWeek'] = weekdayFix(Number(rawCourse['dayOfWeek']))
            rawCourse['weeks'] = weekParser(rawCourse['weeks'])

            rawCourses.push(rawCourse)
        }
    }

    let courseMap = {}
    for (const rawCourse of rawCourses) {
        const key = `${rawCourse['courseName']}-${rawCourse['dayOfWeek']}-${sum(rawCourse['weeks'])}`
        if (courseMap[key] !== undefined) {
            courseMap[key].push(rawCourse)
        } else {
            courseMap[key] = [rawCourse]
            courseMap[key]['name'] = rawCourse['courseName']
            courseMap[key]['weeks'] = rawCourse['weeks']
            courseMap[key]['teacher'] = rawCourse['teacherName']
            courseMap[key]['location'] = rawCourse['classroomName']
            courseMap[key]['day'] = rawCourse['dayOfWeek']
        }
    }
    let result = []
    for (const courseMapElement in courseMap) {
        const course = courseMap[courseMapElement]
        let resultElement = {
            name: course['name'],
            position: course['location'],
            teacher: course['teacher'],
            day: course['day'],
            weeks: course['weeks'],
            sections: []
        }
        for (const section of course) {
            const sector = {
                section: Number(section['time']['timeCode']),
                //startTime: section['time']['startTime'],
                //endTime: section['time']['endTime']
            }
            resultElement['sections'].push(sector)
        }
        result.push(resultElement)
    }
    return {
        courseInfos: result,
        sectionTimes
    }
}
