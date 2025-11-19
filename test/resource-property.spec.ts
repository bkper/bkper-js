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

    describe('hidden property filtering', () => {
        
        describe('setProperty with filterHidden', () => {
            it('should skip hidden property when filterHidden is true', () => {
                const resource = new TestResourceProperty({});
                resource.setProperty('hidden_', 'value', true);
                
                expect(resource.getProperties()).to.deep.equal({});
            });

            it('should set hidden property when filterHidden is false', () => {
                const resource = new TestResourceProperty({});
                resource.setProperty('hidden_', 'value', false);
                
                expect(resource.getProperty('hidden_')).to.equal('value');
            });

            it('should set hidden property when filterHidden is omitted (backward compat)', () => {
                const resource = new TestResourceProperty({});
                resource.setProperty('hidden_', 'value');
                
                expect(resource.getProperty('hidden_')).to.equal('value');
            });

            it('should set non-hidden property when filterHidden is true', () => {
                const resource = new TestResourceProperty({});
                resource.setProperty('normal', 'value', true);
                
                expect(resource.getProperty('normal')).to.equal('value');
            });

            it('should handle single underscore as hidden', () => {
                const resource = new TestResourceProperty({});
                resource.setProperty('_', 'value', true);
                
                expect(resource.getProperties()).to.deep.equal({});
            });

            it('should handle multiple underscores as hidden', () => {
                const resource = new TestResourceProperty({});
                resource.setProperty('key__', 'value', true);
                
                expect(resource.getProperties()).to.deep.equal({});
            });

            it('should not treat underscore in middle as hidden', () => {
                const resource = new TestResourceProperty({});
                resource.setProperty('key_middle', 'value', true);
                
                expect(resource.getProperty('key_middle')).to.equal('value');
            });

            it('should return this for chaining when filtering', () => {
                const resource = new TestResourceProperty({});
                const result = resource.setProperty('hidden_', 'value', true);
                
                expect(result).to.equal(resource);
            });
        });

        describe('setProperties with filterHidden', () => {
            it('should filter out hidden properties when filterHidden is true', () => {
                const resource = new TestResourceProperty({});
                resource.setProperties({ 
                    normal1: 'value1', 
                    hidden_: 'value2',
                    normal2: 'value3'
                }, true);
                
                expect(resource.getProperties()).to.deep.equal({ 
                    normal1: 'value1',
                    normal2: 'value3'
                });
            });

            it('should set all properties when filterHidden is false', () => {
                const resource = new TestResourceProperty({});
                resource.setProperties({ 
                    normal: 'value1', 
                    hidden_: 'value2'
                }, false);
                
                expect(resource.getProperties()).to.deep.equal({ 
                    normal: 'value1',
                    hidden_: 'value2'
                });
            });

            it('should set all properties when filterHidden is omitted (backward compat)', () => {
                const resource = new TestResourceProperty({});
                resource.setProperties({ 
                    normal: 'value1', 
                    hidden_: 'value2'
                });
                
                expect(resource.getProperties()).to.deep.equal({ 
                    normal: 'value1',
                    hidden_: 'value2'
                });
            });

            it('should filter multiple hidden properties', () => {
                const resource = new TestResourceProperty({});
                resource.setProperties({ 
                    normal: 'value1', 
                    hidden1_: 'value2',
                    hidden2_: 'value3',
                    another: 'value4'
                }, true);
                
                expect(resource.getProperties()).to.deep.equal({ 
                    normal: 'value1',
                    another: 'value4'
                });
            });

            it('should handle all hidden properties', () => {
                const resource = new TestResourceProperty({});
                resource.setProperties({ 
                    hidden1_: 'value1', 
                    hidden2_: 'value2'
                }, true);
                
                expect(resource.getProperties()).to.deep.equal({});
            });

            it('should return this for chaining when filtering', () => {
                const resource = new TestResourceProperty({});
                const result = resource.setProperties({ hidden_: 'value' }, true);
                
                expect(result).to.equal(resource);
            });
        });
    });
});
