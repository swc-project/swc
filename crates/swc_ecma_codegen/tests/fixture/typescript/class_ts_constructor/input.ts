export class A {
    constructor(
        @IInstantiationService protected readonly _instantiationService: IInstantiationService,
        @IContainerService private readonly _containerService: IContainerService,
    ) {
    }
}
