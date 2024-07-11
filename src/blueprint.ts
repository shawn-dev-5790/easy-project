/**
 * 프로세스 메니저는 프로세스 빌더를 통해서 만들어진 프로세스를 관리하는 클래스이다.
 *
 * 관리 기능
 * 1. 프로세스의 실행 흐름을 제어한다.
 * 2. 프로세스의 데이터 흐름을 제어한다.
 * 3. 프로세스는 프로세스 빌더에 의해서 만들어지며, 프로세스 빌더는 자신의 행동을 메니저에게 보고 해야한다.
 * 4. 프로세스들에서 일어나는 일을 로깅 할 수 있어야 한다.
 * 5. 각 프로세스들을 모아서 그룹핑 하고, 각 스테이지들을 리 그룹핑해서 재사용성을 올릴 수 있어야 한다
 * 6. 확장이 가능해야한다. 어떤 에드온 기능들이 들어와도 체이닝으로 유연하게 대처할 수 있어야 한다.
 *
 */
export class ProcessManager {}
export class ProcessBuilder {}

export class Service {}
export class Util {}

/**
 * Layers
 * 
 * services
 * namespaces
 * utils
 * managers
 * 
 * 
 */