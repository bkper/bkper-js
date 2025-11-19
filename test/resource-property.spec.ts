import { expect } from 'chai';
import { ResourceProperty } from '../src/model/ResourceProperty.js';
import { Config } from '../src/model/Config.js';

// Concrete test class to test the abstract ResourceProperty
class TestResourceProperty extends ResourceProperty<{ properties?: { [key: string]: string } }> {
    protected getConfig(): Config {
        return {};
    }
}

describe('ResourceProperty', () => {
    
    describe('getProperties', () => {
        it('should return empty object when properties is null', () => {
            const resource = new TestResourceProperty({});
            expect(resource.getProperties()).to.deep.equal({});
        });

        it('should return copy of properties', () => {
            const resource = new TestResourceProperty({ properties: { key1: 'value1', key2: 'value2' } });
            const props = resource.getProperties();
            expect(props).to.deep.equal({ key1: 'value1', key2: 'value2' });
            
            // Verify it's a copy, not a reference
            props.key3 = 'value3';
            expect(resource.getProperties()).to.deep.equal({ key1: 'value1', key2: 'value2' });
        });
    });

    describe('setProperties', () => {
        it('should set properties and return this for chaining', () => {
            const resource = new TestResourceProperty({});
            const result = resource.setProperties({ key1: 'value1', key2: 'value2' });
            
            expect(result).to.equal(resource);
            expect(resource.getProperties()).to.deep.equal({ key1: 'value1', key2: 'value2' });
        });

        it('should create a copy of the input properties', () => {
            const resource = new TestResourceProperty({});
            const input: { [key: string]: string } = { key1: 'value1' };
            resource.setProperties(input);
            
            input.key2 = 'value2';
            expect(resource.getProperties()).to.deep.equal({ key1: 'value1' });
        });

        it('should replace existing properties', () => {
            const resource = new TestResourceProperty({ properties: { old: 'value' } });
            resource.setProperties({ new: 'value' });
            
            expect(resource.getProperties()).to.deep.equal({ new: 'value' });
        });
    });

    describe('getProperty', () => {
        it('should return undefined when property does not exist', () => {
            const resource = new TestResourceProperty({});
            expect(resource.getProperty('missing')).to.be.undefined;
        });

        it('should return property value when it exists', () => {
            const resource = new TestResourceProperty({ properties: { key1: 'value1' } });
            expect(resource.getProperty('key1')).to.equal('value1');
        });

        it('should return undefined for empty string values', () => {
            const resource = new TestResourceProperty({ properties: { key1: '' } });
            expect(resource.getProperty('key1')).to.be.undefined;
        });

        it('should return undefined for whitespace-only values', () => {
            const resource = new TestResourceProperty({ properties: { key1: '   ' } });
            expect(resource.getProperty('key1')).to.be.undefined;
        });

        it('should support multiple fallback keys', () => {
            const resource = new TestResourceProperty({ properties: { key2: 'value2' } });
            expect(resource.getProperty('key1', 'key2', 'key3')).to.equal('value2');
        });

        it('should return first non-empty property when multiple keys provided', () => {
            const resource = new TestResourceProperty({ 
                properties: { key1: '', key2: 'value2', key3: 'value3' } 
            });
            expect(resource.getProperty('key1', 'key2', 'key3')).to.equal('value2');
        });
    });

    describe('setProperty', () => {
        it('should set property and return this for chaining', () => {
            const resource = new TestResourceProperty({});
            const result = resource.setProperty('key1', 'value1');
            
            expect(result).to.equal(resource);
            expect(resource.getProperty('key1')).to.equal('value1');
        });

        it('should initialize properties object if null', () => {
            const resource = new TestResourceProperty({});
            resource.setProperty('key1', 'value1');
            
            expect(resource.getProperties()).to.deep.equal({ key1: 'value1' });
        });

        it('should convert null value to empty string', () => {
            const resource = new TestResourceProperty({});
            resource.setProperty('key1', null);
            
            expect(resource.payload.properties?.key1).to.equal('');
        });

        it('should convert undefined value to empty string', () => {
            const resource = new TestResourceProperty({});
            resource.setProperty('key1', undefined);
            
            expect(resource.payload.properties?.key1).to.equal('');
        });

        it('should do nothing when key is null', () => {
            const resource = new TestResourceProperty({});
            resource.setProperty(null as any, 'value1');
            
            expect(resource.getProperties()).to.deep.equal({});
        });

        it('should do nothing when key is empty string', () => {
            const resource = new TestResourceProperty({});
            resource.setProperty('', 'value1');
            
            expect(resource.getProperties()).to.deep.equal({});
        });

        it('should do nothing when key is whitespace only', () => {
            const resource = new TestResourceProperty({});
            resource.setProperty('   ', 'value1');
            
            expect(resource.getProperties()).to.deep.equal({});
        });

        it('should update existing property', () => {
            const resource = new TestResourceProperty({ properties: { key1: 'old' } });
            resource.setProperty('key1', 'new');
            
            expect(resource.getProperty('key1')).to.equal('new');
        });
    });

    describe('deleteProperty', () => {
        it('should delete property by setting it to empty string', () => {
            const resource = new TestResourceProperty({ properties: { key1: 'value1' } });
            const result = resource.deleteProperty('key1');
            
            expect(result).to.equal(resource);
            expect(resource.payload.properties?.key1).to.equal('');
        });

        it('should work for chaining', () => {
            const resource = new TestResourceProperty({ properties: { key1: 'value1', key2: 'value2' } });
            resource.deleteProperty('key1').deleteProperty('key2');
            
            expect(resource.payload.properties?.key1).to.equal('');
            expect(resource.payload.properties?.key2).to.equal('');
        });
    });

    describe('getPropertyKeys', () => {
        it('should return empty array when no properties', () => {
            const resource = new TestResourceProperty({});
            expect(resource.getPropertyKeys()).to.deep.equal([]);
        });

        it('should return all property keys sorted alphabetically', () => {
            const resource = new TestResourceProperty({ 
                properties: { zebra: 'z', apple: 'a', banana: 'b' } 
            });
            expect(resource.getPropertyKeys()).to.deep.equal(['apple', 'banana', 'zebra']);
        });

        it('should only return own properties', () => {
            const resource = new TestResourceProperty({ properties: { key1: 'value1' } });
            expect(resource.getPropertyKeys()).to.deep.equal(['key1']);
        });
    });

    describe('visible property methods', () => {
        
        describe('setVisibleProperty', () => {
            it('should skip hidden property', () => {
                const resource = new TestResourceProperty({});
                resource.setVisibleProperty('hidden_', 'value');
                
                expect(resource.getProperties()).to.deep.equal({});
            });

            it('should set non-hidden property', () => {
                const resource = new TestResourceProperty({});
                resource.setVisibleProperty('normal', 'value');
                
                expect(resource.getProperty('normal')).to.equal('value');
            });

            it('should handle single underscore as hidden', () => {
                const resource = new TestResourceProperty({});
                resource.setVisibleProperty('_', 'value');
                
                expect(resource.getProperties()).to.deep.equal({});
            });

            it('should handle multiple underscores as hidden', () => {
                const resource = new TestResourceProperty({});
                resource.setVisibleProperty('key__', 'value');
                
                expect(resource.getProperties()).to.deep.equal({});
            });

            it('should not treat underscore in middle as hidden', () => {
                const resource = new TestResourceProperty({});
                resource.setVisibleProperty('key_middle', 'value');
                
                expect(resource.getProperty('key_middle')).to.equal('value');
            });

            it('should return this for chaining', () => {
                const resource = new TestResourceProperty({});
                const result = resource.setVisibleProperty('hidden_', 'value');
                
                expect(result).to.equal(resource);
            });

            it('should allow chaining with regular setProperty', () => {
                const resource = new TestResourceProperty({});
                resource
                    .setVisibleProperty('visible', 'value1')
                    .setProperty('hidden_', 'value2');
                
                expect(resource.getProperties()).to.deep.equal({
                    visible: 'value1',
                    hidden_: 'value2'
                });
            });

            it('should update existing visible property', () => {
                const resource = new TestResourceProperty({ properties: { key1: 'old' } });
                resource.setVisibleProperty('key1', 'new');
                
                expect(resource.getProperty('key1')).to.equal('new');
            });
        });

        describe('setVisibleProperties', () => {
            it('should filter out hidden properties', () => {
                const resource = new TestResourceProperty({});
                resource.setVisibleProperties({ 
                    normal1: 'value1', 
                    hidden_: 'value2',
                    normal2: 'value3'
                });
                
                expect(resource.getProperties()).to.deep.equal({ 
                    normal1: 'value1',
                    normal2: 'value3'
                });
            });

            it('should filter multiple hidden properties', () => {
                const resource = new TestResourceProperty({});
                resource.setVisibleProperties({ 
                    normal: 'value1', 
                    hidden1_: 'value2',
                    hidden2_: 'value3',
                    another: 'value4'
                });
                
                expect(resource.getProperties()).to.deep.equal({ 
                    normal: 'value1',
                    another: 'value4'
                });
            });

            it('should handle all hidden properties', () => {
                const resource = new TestResourceProperty({});
                resource.setVisibleProperties({ 
                    hidden1_: 'value1', 
                    hidden2_: 'value2'
                });
                
                expect(resource.getProperties()).to.deep.equal({});
            });

            it('should return this for chaining', () => {
                const resource = new TestResourceProperty({});
                const result = resource.setVisibleProperties({ hidden_: 'value' });
                
                expect(result).to.equal(resource);
            });

            it('should allow chaining with regular setProperty', () => {
                const resource = new TestResourceProperty({});
                resource
                    .setVisibleProperties({ visible: 'value1', hidden1_: 'skip' })
                    .setProperty('hidden2_', 'value2');
                
                expect(resource.getProperties()).to.deep.equal({
                    visible: 'value1',
                    hidden2_: 'value2'
                });
            });

            it('should handle null properties gracefully', () => {
                const resource = new TestResourceProperty({});
                resource.setVisibleProperties(null as any);
                
                expect(resource.getProperties()).to.deep.equal({});
            });
        });

        describe('getVisibleProperties', () => {
            it('should return only visible properties', () => {
                const resource = new TestResourceProperty({ 
                    properties: { 
                        visible1: 'value1', 
                        hidden_: 'value2',
                        visible2: 'value3'
                    } 
                });
                
                expect(resource.getVisibleProperties()).to.deep.equal({
                    visible1: 'value1',
                    visible2: 'value3'
                });
            });

            it('should return empty object when no properties', () => {
                const resource = new TestResourceProperty({});
                expect(resource.getVisibleProperties()).to.deep.equal({});
            });

            it('should return empty object when all properties are hidden', () => {
                const resource = new TestResourceProperty({ 
                    properties: { 
                        hidden1_: 'value1', 
                        hidden2_: 'value2'
                    } 
                });
                
                expect(resource.getVisibleProperties()).to.deep.equal({});
            });

            it('should return copy not reference', () => {
                const resource = new TestResourceProperty({ 
                    properties: { visible: 'value1', hidden_: 'value2' } 
                });
                const props = resource.getVisibleProperties();
                
                props.newKey = 'newValue';
                expect(resource.getVisibleProperties()).to.deep.equal({ visible: 'value1' });
            });

            it('should handle properties with underscore in middle', () => {
                const resource = new TestResourceProperty({ 
                    properties: { 
                        key_middle: 'value1',
                        hidden_: 'value2'
                    } 
                });
                
                expect(resource.getVisibleProperties()).to.deep.equal({
                    key_middle: 'value1'
                });
            });

            it('should handle single underscore as hidden', () => {
                const resource = new TestResourceProperty({ 
                    properties: { 
                        normal: 'value1',
                        _: 'value2'
                    } 
                });
                
                expect(resource.getVisibleProperties()).to.deep.equal({
                    normal: 'value1'
                });
            });
        });
    });
});
